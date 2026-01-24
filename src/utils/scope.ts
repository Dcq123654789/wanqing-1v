// src/utils/scope.ts

import Taro from "@tarojs/taro";

// ===================== 基础配置 =====================
/** 解析基础地址优先级：运行时全局 -> 环境变量 -> 空字符串 */
function resolveBaseUrl(): string {
  // @ts-ignore
  const runtime = (typeof window !== "undefined" && (window as any).BASE_URL) || "";
  let viteEnv = "";
  try {
    // @ts-ignore
    viteEnv = (import.meta as any)?.env?.VITE_API_BASE || "";
  } catch {}
  // @ts-ignore
  const nodeEnv = (typeof process !== "undefined" &&
    (process.env.API_BASE_URL || process.env.VITE_API_BASE)) || "";
  return String(runtime || viteEnv || nodeEnv || "").replace(/\/+$/, "");
}

let BASE_URL = resolveBaseUrl();

/** 允许运行时覆盖基础地址 */
function setBaseUrl(url: string) {
  BASE_URL = String(url || "").replace(/\/+$/, "");
}

/** 组合为绝对地址：仅当以 / 开头时拼接 BASE_URL */
function toAbsoluteUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return `${BASE_URL}${url}`;
  return url;
}

// ===================== Token 管理 =====================
/** 获取 token 并检查过期 */
function getToken(): string | null {
  const token = Taro.getStorageSync("token");
  const tokenExpireTime = Taro.getStorageSync("tokenExpireTime");

  if (!token || !tokenExpireTime || Date.now() > tokenExpireTime) {
    Taro.removeStorageSync("token");
    Taro.removeStorageSync("tokenExpireTime");
    Taro.removeStorageSync("openid");
    Taro.removeStorageSync("userInfo");
    Taro.reLaunch({ url: "/pages/login/index" });
    return null;
  }

  return token;
}

// ===================== HTTP 请求 =====================
const http = {
  async get(url: string, options: { params?: any; header?: Record<string, any> } = {}) {
    const token = getToken();
    const query = options.params ? "?" + new URLSearchParams(options.params).toString() : "";
    const res = await Taro.request({
      url: toAbsoluteUrl(url) + query,
      method: "GET",
      header: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.header || {}),
      },
    });
    return { data: res.data };
  },

  async post(url: string, data?: any, options: { header?: Record<string, any> } = {}) {
    const token = getToken();
    const res = await Taro.request({
      url: toAbsoluteUrl(url),
      method: "POST",
      data: data ?? {},
      header: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.header || {}),
      },
    });
    return { data: res.data };
  },

  async put(url: string, data?: any, options: { header?: Record<string, any> } = {}) {
    const token = getToken();
    const res = await Taro.request({
      url: toAbsoluteUrl(url),
      method: "PUT",
      data: data ?? {},
      header: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.header || {}),
      },
    });
    return { data: res.data };
  },

  async delete(url: string, options: { params?: any; header?: Record<string, any> } = {}) {
    const token = getToken();
    const query = options.params ? "?" + new URLSearchParams(options.params).toString() : "";
    const res = await Taro.request({
      url: toAbsoluteUrl(url) + query,
      method: "DELETE",
      header: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.header || {}),
      },
    });
    return { data: res.data };
  },
};

// ===================== UI 工具 =====================
const showLoading = (title = "加载中...") => Taro.showLoading({ title, mask: true });
const hideLoading = () => Taro.hideLoading();
const showError = (title: string, duration = 2000) =>
  Taro.showToast({ title, icon: "error", duration });

// ===================== 网络请求快捷方法 =====================
async function get(url: string, params?: Record<string, any>) {
  const res = await http.get(url, { params });
  return res.data;
}

async function post(url: string, data?: any) {
  const res = await http.post(url, data ?? {});
  return res.data;
}

async function put(url: string, data?: any) {
  const res = await http.put(url, data ?? {});
  return res.data;
}

async function del(url: string, params?: Record<string, any>) {
  const res = await http.delete(url, { params });
  return res.data;
}

// ===================== 导出 =====================
const scope = {
  // 基础配置
  BASE_URL,
  setBaseUrl,
  toAbsoluteUrl,

  // HTTP
  http,
  get,
  post,
  put,
  del,

  // UI 工具
  showLoading,
  hideLoading,
  showError,
};

globalThis.scope = scope;
export default scope;
