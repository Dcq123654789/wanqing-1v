#!/usr/bin/env pwsh
# 创建新功能
[CmdletBinding()]
param(
    [switch]$Json,
    [string]$ShortName,
    [int]$Number = 0,
    [switch]$Help,
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$FeatureDescription
)
$ErrorActionPreference = 'Stop'

# 如果请求则显示帮助
if ($Help) {
    Write-Host "用法: ./create-new-feature.ps1 [-Json] [-ShortName <name>] [-Number N] <feature description>"
    Write-Host ""
    Write-Host "选项:"
    Write-Host "  -Json               以 JSON 格式输出"
    Write-Host "  -ShortName <name>   为分支提供自定义短名称（2-4个词）"
    Write-Host "  -Number N           手动指定分支编号（覆盖自动检测）"
    Write-Host "  -Help               显示此帮助消息"
    Write-Host ""
    Write-Host "示例:"
    Write-Host "  ./create-new-feature.ps1 '添加用户认证系统' -ShortName 'user-auth'"
    Write-Host "  ./create-new-feature.ps1 '为 API 实现 OAuth2 集成'"
    exit 0
}

# 检查是否提供了功能描述
if (-not $FeatureDescription -or $FeatureDescription.Count -eq 0) {
    Write-Error "用法: ./create-new-feature.ps1 [-Json] [-ShortName <name>] <feature description>"
    exit 1
}

$featureDesc = ($FeatureDescription -join ' ').Trim()

# 解析仓库根目录。优先使用 git 信息，但回退到搜索仓库标记符，
# 以便工作流在使用 --no-git 初始化的仓库中仍然有效。
function Find-RepositoryRoot {
    param(
        [string]$StartDir,
        [string[]]$Markers = @('.git', '.specify')
    )
    $current = Resolve-Path $StartDir
    while ($true) {
        foreach ($marker in $Markers) {
            if (Test-Path (Join-Path $current $marker)) {
                return $current
            }
        }
        $parent = Split-Path $current -Parent
        if ($parent -eq $current) {
            # 到达文件系统根目录仍未找到标记符
            return $null
        }
        $current = $parent
    }
}

function Get-HighestNumberFromSpecs {
    param([string]$SpecsDir)

    $highest = 0
    if (Test-Path $SpecsDir) {
        Get-ChildItem -Path $SpecsDir -Directory | ForEach-Object {
            if ($_.Name -match '^(\d+)') {
                $num = [int]$matches[1]
                if ($num -gt $highest) { $highest = $num }
            }
        }
    }
    return $highest
}

function Get-HighestNumberFromBranches {
    param()

    $highest = 0
    try {
        $branches = git branch -a 2>$null
        if ($LASTEXITCODE -eq 0) {
            foreach ($branch in $branches) {
                # 清理分支名称: 移除前导标记和远程前缀
                $cleanBranch = $branch.Trim() -replace '^\*?\s+', '' -replace '^remotes/[^/]+/', ''

                # 如果分支匹配 ###-* 模式则提取功能编号
                if ($cleanBranch -match '^(\d+)-') {
                    $num = [int]$matches[1]
                    if ($num -gt $highest) { $highest = $num }
                }
            }
        }
    } catch {
        # 如果 git 命令失败，返回 0
        Write-Verbose "无法检查 Git 分支: $_"
    }
    return $highest
}

function Get-NextBranchNumber {
    param(
        [string]$SpecsDir
    )

    # 获取所有远程的最新分支信息（如果没有远程则抑制错误）
    try {
        git fetch --all --prune 2>$null | Out-Null
    } catch {
        # 忽略获取错误
    }

    # 从所有分支中获取最大编号（不仅仅是匹配短名称的）
    $highestBranch = Get-HighestNumberFromBranches

    # 从所有规格中获取最大编号（不仅仅是匹配短名称的）
    $highestSpec = Get-HighestNumberFromSpecs -SpecsDir $SpecsDir

    # 取两者的最大值
    $maxNum = [Math]::Max($highestBranch, $highestSpec)

    # 返回下一个编号
    return $maxNum + 1
}

function ConvertTo-CleanBranchName {
    param([string]$Name)

    return $Name.ToLower() -replace '[^a-z0-9]', '-' -replace '-{2,}', '-' -replace '^-', '' -replace '-$', ''
}
$fallbackRoot = (Find-RepositoryRoot -StartDir $PSScriptRoot)
if (-not $fallbackRoot) {
    Write-Error "错误: 无法确定仓库根目录。请从仓库内运行此脚本。"
    exit 1
}

try {
    $repoRoot = git rev-parse --show-toplevel 2>$null
    if ($LASTEXITCODE -eq 0) {
        $hasGit = $true
    } else {
        throw "Git 不可用"
    }
} catch {
    $repoRoot = $fallbackRoot
    $hasGit = $false
}

Set-Location $repoRoot

$specsDir = Join-Path $repoRoot 'specs'
New-Item -ItemType Directory -Path $specsDir -Force | Out-Null

# 生成分支名称的函数，包含停用词过滤和长度过滤
function Get-BranchName {
    param([string]$Description)

    # 要过滤的常见停用词
    $stopWords = @(
        'i', 'a', 'an', 'the', 'to', 'for', 'of', 'in', 'on', 'at', 'by', 'with', 'from',
        'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
        'do', 'does', 'did', 'will', 'would', 'should', 'could', 'can', 'may', 'might', 'must', 'shall',
        'this', 'that', 'these', 'those', 'my', 'your', 'our', 'their',
        'want', 'need', 'add', 'get', 'set'
    )

    # 转换为小写并提取单词（仅字母数字）
    $cleanName = $Description.ToLower() -replace '[^a-z0-9\s]', ' '
    $words = $cleanName -split '\s+' | Where-Object { $_ }

    # 过滤单词: 移除停用词和短于3个字符的单词（除非它们在原文中是大写缩写）
    $meaningfulWords = @()
    foreach ($word in $words) {
        # 跳过停用词
        if ($stopWords -contains $word) { continue }

        # 保留长度 >= 3 的单词，或在原文中为大写的单词（可能是缩写）
        if ($word.Length -ge 3) {
            $meaningfulWords += $word
        } elseif ($Description -match "\b$($word.ToUpper())\b") {
            # 如果短单词在原文中为大写则保留（可能是缩写）
            $meaningfulWords += $word
        }
    }

    # 如果我们有有意义的单词，使用前 3-4 个
    if ($meaningfulWords.Count -gt 0) {
        $maxWords = if ($meaningfulWords.Count -eq 4) { 4 } else { 3 }
        $result = ($meaningfulWords | Select-Object -First $maxWords) -join '-'
        return $result
    } else {
        # 如果未找到有意义的单词，回退到原始逻辑
        $result = ConvertTo-CleanBranchName -Name $Description
        $fallbackWords = ($result -split '-') | Where-Object { $_ } | Select-Object -First 3
        return [string]::Join('-', $fallbackWords)
    }
}

# 生成分支名称
if ($ShortName) {
    # 使用提供的短名称，只需清理它
    $branchSuffix = ConvertTo-CleanBranchName -Name $ShortName
} else {
    # 从描述中生成，使用智能过滤
    $branchSuffix = Get-BranchName -Description $featureDesc
}

# 确定分支编号
if ($Number -eq 0) {
    if ($hasGit) {
        # 检查远程上的现有分支
        $Number = Get-NextBranchNumber -SpecsDir $specsDir
    } else {
        # 回退到本地目录检查
        $Number = (Get-HighestNumberFromSpecs -SpecsDir $specsDir) + 1
    }
}

$featureNum = ('{0:000}' -f $Number)
$branchName = "$featureNum-$branchSuffix"

# GitHub 对分支名称强制执行 244 字节的限制
# 如有必要则验证并截断
$maxBranchLength = 244
if ($branchName.Length -gt $maxBranchLength) {
    # 计算需要从后缀中修剪多少
    # 考虑: 功能编号（3）+ 连字符（1）= 4 个字符
    $maxSuffixLength = $maxBranchLength - 4

    # 截断后缀
    $truncatedSuffix = $branchSuffix.Substring(0, [Math]::Min($branchSuffix.Length, $maxSuffixLength))
    # 如果截断创建了尾部连字符则移除
    $truncatedSuffix = $truncatedSuffix -replace '-$', ''

    $originalBranchName = $branchName
    $branchName = "$featureNum-$truncatedSuffix"

    Write-Warning "[specify] 分支名称超过了 GitHub 的 244 字节限制"
    Write-Warning "[specify] 原始: $originalBranchName ($($originalBranchName.Length) 字节)"
    Write-Warning "[specify] 截断为: $branchName ($($branchName.Length) 字节)"
}

if ($hasGit) {
    try {
        git checkout -b $branchName | Out-Null
    } catch {
        Write-Warning "创建 git 分支失败: $branchName"
    }
} else {
    Write-Warning "[specify] 警告: 未检测到 Git 仓库；已跳过 $branchName 的分支创建"
}

$featureDir = Join-Path $specsDir $branchName
New-Item -ItemType Directory -Path $featureDir -Force | Out-Null

$template = Join-Path $repoRoot '.specify/templates/spec-template.md'
$specFile = Join-Path $featureDir 'spec.md'
if (Test-Path $template) {
    Copy-Item $template $specFile -Force
} else {
    New-Item -ItemType File -Path $specFile | Out-Null
}

# 为当前会话设置 SPECIFY_FEATURE 环境变量
$env:SPECIFY_FEATURE = $branchName

if ($Json) {
    $obj = [PSCustomObject]@{
        BRANCH_NAME = $branchName
        SPEC_FILE = $specFile
        FEATURE_NUM = $featureNum
        HAS_GIT = $hasGit
    }
    $obj | ConvertTo-Json -Compress
} else {
    Write-Output "BRANCH_NAME: $branchName"
    Write-Output "SPEC_FILE: $specFile"
    Write-Output "FEATURE_NUM: $featureNum"
    Write-Output "HAS_GIT: $hasGit"
    Write-Output "SPECIFY_FEATURE 环境变量已设置为: $branchName"
}
