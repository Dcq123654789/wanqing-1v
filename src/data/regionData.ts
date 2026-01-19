/**
 * 省市区三级联动数据（简化版）
 * 包含主要省份和城市，用于地址选择
 */

export interface RegionData {
  name: string
  children?: CityData[]
}

export interface CityData {
  name: string
  children?: DistrictData[]
}

export interface DistrictData {
  name: string
}

/**
 * 省市区数据
 */
export const regionData: RegionData[] = [
  {
    name: '北京市',
    children: [
      {
        name: '北京市',
        children: [
          { name: '东城区' },
          { name: '西城区' },
          { name: '朝阳区' },
          { name: '丰台区' },
          { name: '石景山区' },
          { name: '海淀区' },
          { name: '门头沟区' },
          { name: '房山区' },
          { name: '通州区' },
          { name: '顺义区' },
          { name: '昌平区' },
          { name: '大兴区' },
          { name: '怀柔区' },
          { name: '平谷区' },
          { name: '密云区' },
          { name: '延庆区' }
        ]
      }
    ]
  },
  {
    name: '上海市',
    children: [
      {
        name: '上海市',
        children: [
          { name: '黄浦区' },
          { name: '徐汇区' },
          { name: '长宁区' },
          { name: '静安区' },
          { name: '普陀区' },
          { name: '虹口区' },
          { name: '杨浦区' },
          { name: '闵行区' },
          { name: '宝山区' },
          { name: '嘉定区' },
          { name: '浦东新区' },
          { name: '金山区' },
          { name: '松江区' },
          { name: '青浦区' },
          { name: '奉贤区' },
          { name: '崇明区' }
        ]
      }
    ]
  },
  {
    name: '广东省',
    children: [
      {
        name: '广州市',
        children: [
          { name: '荔湾区' },
          { name: '越秀区' },
          { name: '海珠区' },
          { name: '天河区' },
          { name: '白云区' },
          { name: '黄埔区' },
          { name: '番禺区' },
          { name: '花都区' },
          { name: '南沙区' },
          { name: '从化区' },
          { name: '增城区' }
        ]
      },
      {
        name: '深圳市',
        children: [
          { name: '罗湖区' },
          { name: '福田区' },
          { name: '南山区' },
          { name: '宝安区' },
          { name: '龙岗区' },
          { name: '盐田区' },
          { name: '龙华区' },
          { name: '坪山区' },
          { name: '光明区' }
        ]
      },
      {
        name: '珠海市',
        children: [
          { name: '香洲区' },
          { name: '斗门区' },
          { name: '金湾区' }
        ]
      },
      {
        name: '佛山市',
        children: [
          { name: '禅城区' },
          { name: '南海区' },
          { name: '顺德区' },
          { name: '高明区' },
          { name: '三水区' }
        ]
      },
      {
        name: '东莞市',
        children: [
          { name: '东莞市' }
        ]
      }
    ]
  },
  {
    name: '浙江省',
    children: [
      {
        name: '杭州市',
        children: [
          { name: '上城区' },
          { name: '拱墅区' },
          { name: '西湖区' },
          { name: '滨江区' },
          { name: '萧山区' },
          { name: '余杭区' },
          { name: '临平区' },
          { name: '钱塘区' },
          { name: '富阳区' },
          { name: '临安区' },
          { name: '桐庐县' },
          { name: '淳安县' },
          { name: '建德市' }
        ]
      },
      {
        name: '宁波市',
        children: [
          { name: '海曙区' },
          { name: '江北区' },
          { name: '北仑区' },
          { name: '镇海区' },
          { name: '鄞州区' },
          { name: '奉化区' },
          { name: '象山县' },
          { name: '宁海县' },
          { name: '余姚市' },
          { name: '慈溪市' }
        ]
      },
      {
        name: '温州市',
        children: [
          { name: '鹿城区' },
          { name: '龙湾区' },
          { name: '瓯海区' },
          { name: '洞头区' },
          { name: '永嘉县' },
          { name: '平阳县' },
          { name: '苍南县' },
          { name: '文成县' },
          { name: '泰顺县' },
          { name: '瑞安市' },
          { name: '乐清市' }
        ]
      }
    ]
  },
  {
    name: '江苏省',
    children: [
      {
        name: '南京市',
        children: [
          { name: '玄武区' },
          { name: '秦淮区' },
          { name: '建邺区' },
          { name: '鼓楼区' },
          { name: '浦口区' },
          { name: '栖霞区' },
          { name: '雨花台区' },
          { name: '江宁区' },
          { name: '六合区' },
          { name: '溧水区' },
          { name: '高淳区' }
        ]
      },
      {
        name: '苏州市',
        children: [
          { name: '虎丘区' },
          { name: '吴中区' },
          { name: '相城区' },
          { name: '姑苏区' },
          { name: '吴江区' },
          { name: '常熟市' },
          { name: '张家港市' },
          { name: '昆山市' },
          { name: '太仓市' }
        ]
      },
      {
        name: '无锡市',
        children: [
          { name: '锡山区' },
          { name: '惠山区' },
          { name: '滨湖区' },
          { name: '梁溪区' },
          { name: '新吴区' },
          { name: '江阴市' },
          { name: '宜兴市' }
        ]
      }
    ]
  },
  {
    name: '四川省',
    children: [
      {
        name: '成都市',
        children: [
          { name: '锦江区' },
          { name: '青羊区' },
          { name: '金牛区' },
          { name: '武侯区' },
          { name: '成华区' },
          { name: '龙泉驿区' },
          { name: '青白江区' },
          { name: '新都区' },
          { name: '温江区' },
          { name: '双流区' },
          { name: '郫都区' },
          { name: '新津区' },
          { name: '都江堰市' },
          { name: '彭州市' },
          { name: '邛崃市' },
          { name: '崇州市' },
          { name: '金堂县' },
          { name: '大邑县' },
          { name: '蒲江县' }
        ]
      }
    ]
  },
  {
    name: '湖北省',
    children: [
      {
        name: '武汉市',
        children: [
          { name: '江岸区' },
          { name: '江汉区' },
          { name: '硚口区' },
          { name: '汉阳区' },
          { name: '武昌区' },
          { name: '青山区' },
          { name: '洪山区' },
          { name: '东西湖区' },
          { name: '汉南区' },
          { name: '蔡甸区' },
          { name: '江夏区' },
          { name: '黄陂区' },
          { name: '新洲区' }
        ]
      }
    ]
  },
  {
    name: '陕西省',
    children: [
      {
        name: '西安市',
        children: [
          { name: '新城区' },
          { name: '碑林区' },
          { name: '莲湖区' },
          { name: '灞桥区' },
          { name: '未央区' },
          { name: '雁塔区' },
          { name: '阎良区' },
          { name: '临潼区' },
          { name: '长安区' },
          { name: '高陵区' },
          { name: '鄠邑区' },
          { name: '蓝田县' },
          { name: '周至县' }
        ]
      }
    ]
  },
  {
    name: '山东省',
    children: [
      {
        name: '济南市',
        children: [
          { name: '历下区' },
          { name: '市中区' },
          { name: '槐荫区' },
          { name: '天桥区' },
          { name: '历城区' },
          { name: '长清区' },
          { name: '章丘区' },
          { name: '济阳区' },
          { name: '莱芜区' },
          { name: '钢城区' },
          { name: '平阴县' },
          { name: '商河县' }
        ]
      },
      {
        name: '青岛市',
        children: [
          { name: '市南区' },
          { name: '市北区' },
          { name: '黄岛区' },
          { name: '崂山区' },
          { name: '李沧区' },
          { name: '城阳区' },
          { name: '即墨区' },
          { name: '胶州市' },
          { name: '平度市' },
          { name: '莱西市' }
        ]
      }
    ]
  },
  {
    name: '河南省',
    children: [
      {
        name: '郑州市',
        children: [
          { name: '中原区' },
          { name: '二七区' },
          { name: '管城回族区' },
          { name: '金水区' },
          { name: '上街区' },
          { name: '惠济区' },
          { name: '中牟县' },
          { name: '巩义市' },
          { name: '荥阳市' },
          { name: '新密市' },
          { name: '新郑市' },
          { name: '登封市' }
        ]
      }
    ]
  },
  {
    name: '福建省',
    children: [
      {
        name: '福州市',
        children: [
          { name: '鼓楼区' },
          { name: '台江区' },
          { name: '仓山区' },
          { name: '马尾区' },
          { name: '晋安区' },
          { name: '长乐区' },
          { name: '闽侯县' },
          { name: '连江县' },
          { name: '罗源县' },
          { name: '闽清县' },
          { name: '永泰县' },
          { name: '平潭县' },
          { name: '福清市' }
        ]
      },
      {
        name: '厦门市',
        children: [
          { name: '思明区' },
          { name: '海沧区' },
          { name: '湖里区' },
          { name: '集美区' },
          { name: '同安区' },
          { name: '翔安区' }
        ]
      }
    ]
  },
  {
    name: '天津市',
    children: [
      {
        name: '天津市',
        children: [
          { name: '和平区' },
          { name: '河东区' },
          { name: '河西区' },
          { name: '南开区' },
          { name: '河北区' },
          { name: '红桥区' },
          { name: '东丽区' },
          { name: '西青区' },
          { name: '津南区' },
          { name: '北辰区' },
          { name: '武清区' },
          { name: '宝坻区' },
          { name: '滨海新区' },
          { name: '宁河区' },
          { name: '静海区' },
          { name: '蓟州区' }
        ]
      }
    ]
  },
  {
    name: '重庆市',
    children: [
      {
        name: '重庆市',
        children: [
          { name: '万州区' },
          { name: '涪陵区' },
          { name: '渝中区' },
          { name: '大渡口区' },
          { name: '江北区' },
          { name: '沙坪坝区' },
          { name: '九龙坡区' },
          { name: '南岸区' },
          { name: '北碚区' },
          { name: '綦江区' },
          { name: '大足区' },
          { name: '渝北区' },
          { name: '巴南区' },
          { name: '黔江区' },
          { name: '长寿区' },
          { name: '江津区' },
          { name: '合川区' },
          { name: '永川区' },
          { name: '南川区' },
          { name: '璧山区' },
          { name: '铜梁区' },
          { name: '潼南区' },
          { name: '荣昌区' },
          { name: '开州区' },
          { name: '梁平区' },
          { name: '武隆区' }
        ]
      }
    ]
  },
  {
    name: '辽宁省',
    children: [
      {
        name: '沈阳市',
        children: [
          { name: '和平区' },
          { name: '沈河区' },
          { name: '大东区' },
          { name: '皇姑区' },
          { name: '铁西区' },
          { name: '苏家屯区' },
          { name: '浑南区' },
          { name: '沈北新区' },
          { name: '于洪区' },
          { name: '辽中区' },
          { name: '康平县' },
          { name: '法库县' },
          { name: '新民市' }
        ]
      },
      {
        name: '大连市',
        children: [
          { name: '中山区' },
          { name: '西岗区' },
          { name: '沙河口区' },
          { name: '甘井子区' },
          { name: '旅顺口区' },
          { name: '金州区' },
          { name: '普兰店区' },
          { name: '长海县' },
          { name: '瓦房店市' },
          { name: '庄河市' }
        ]
      }
    ]
  },
  {
    name: '湖南省',
    children: [
      {
        name: '长沙市',
        children: [
          { name: '芙蓉区' },
          { name: '天心区' },
          { name: '岳麓区' },
          { name: '开福区' },
          { name: '雨花区' },
          { name: '望城区' },
          { name: '长沙县' },
          { name: '浏阳市' },
          { name: '宁乡市' }
        ]
      }
    ]
  },
  {
    name: '安徽省',
    children: [
      {
        name: '合肥市',
        children: [
          { name: '瑶海区' },
          { name: '庐阳区' },
          { name: '蜀山区' },
          { name: '包河区' },
          { name: '长丰县' },
          { name: '肥东县' },
          { name: '肥西县' },
          { name: '庐江县' },
          { name: '巢湖市' }
        ]
      }
    ]
  },
  {
    name: '江西省',
    children: [
      {
        name: '南昌市',
        children: [
          { name: '东湖区' },
          { name: '西湖区' },
          { name: '青云谱区' },
          { name: '湾里管理区' },
          { name: '青山湖区' },
          { name: '新建区' },
          { name: '南昌县' },
          { name: '安义县' },
          { name: '进贤县' }
        ]
      }
    ]
  },
  {
    name: '云南省',
    children: [
      {
        name: '昆明市',
        children: [
          { name: '五华区' },
          { name: '盘龙区' },
          { name: '官渡区' },
          { name: '西山区' },
          { name: '东川区' },
          { name: '呈贡区' },
          { name: '晋宁区' },
          { name: '富民县' },
          { name: '宜良县' },
          { name: '石林彝族自治县' },
          { name: '嵩明县' },
          { name: '禄劝彝族苗族自治县' },
          { name: '寻甸回族彝族自治县' },
          { name: '安宁市' }
        ]
      }
    ]
  },
  {
    name: '贵州省',
    children: [
      {
        name: '贵阳市',
        children: [
          { name: '南明区' },
          { name: '云岩区' },
          { name: '花溪区' },
          { name: '乌当区' },
          { name: '白云区' },
          { name: '观山湖区' },
          { name: '开阳县' },
          { name: '息烽县' },
          { name: '修文县' },
          { name: '清镇市' }
        ]
      }
    ]
  },
  {
    name: '河北省',
    children: [
      {
        name: '石家庄市',
        children: [
          { name: '长安区' },
          { name: '桥西区' },
          { name: '新华区' },
          { name: '井陉矿区' },
          { name: '裕华区' },
          { name: '藁城区' },
          { name: '鹿泉区' },
          { name: '栾城区' },
          { name: '井陉县' },
          { name: '正定县' },
          { name: '行唐县' },
          { name: '灵寿县' },
          { name: '高邑县' },
          { name: '深泽县' },
          { name: '赞皇县' },
          { name: '无极县' },
          { name: '平山县' },
          { name: '元氏县' },
          { name: '赵县' },
          { name: '辛集市' },
          { name: '晋州市' },
          { name: '新乐市' }
        ]
      },
      {
        name: '唐山市',
        children: [
          { name: '路南区' },
          { name: '路北区' },
          { name: '古冶区' },
          { name: '开平区' },
          { name: '丰南区' },
          { name: '丰润区' },
          { name: '曹妃甸区' },
          { name: '滦南县' },
          { name: '乐亭县' },
          { name: '迁西县' },
          { name: '玉田县' },
          { name: '遵化市' },
          { name: '迁安市' },
          { name: '滦州市' }
        ]
      }
    ]
  },
  {
    name: '山西省',
    children: [
      {
        name: '太原市',
        children: [
          { name: '小店区' },
          { name: '迎泽区' },
          { name: '杏花岭区' },
          { name: '尖草坪区' },
          { name: '万柏林区' },
          { name: '晋源区' },
          { name: '清徐县' },
          { name: '阳曲县' },
          { name: '娄烦县' },
          { name: '古交市' }
        ]
      }
    ]
  },
  {
    name: '广西壮族自治区',
    children: [
      {
        name: '南宁市',
        children: [
          { name: '兴宁区' },
          { name: '青秀区' },
          { name: '江南区' },
          { name: '西乡塘区' },
          { name: '良庆区' },
          { name: '邕宁区' },
          { name: '武鸣区' },
          { name: '隆安县' },
          { name: '马山县' },
          { name: '上林县' },
          { name: '宾阳县' },
          { name: '横州市' }
        ]
      }
    ]
  },
  {
    name: '黑龙江省',
    children: [
      {
        name: '哈尔滨市',
        children: [
          { name: '道里区' },
          { name: '南岗区' },
          { name: '道外区' },
          { name: '平房区' },
          { name: '松北区' },
          { name: '香坊区' },
          { name: '呼兰区' },
          { name: '阿城区' },
          { name: '双城区' },
          { name: '依兰县' },
          { name: '方正县' },
          { name: '宾县' },
          { name: '巴彦县' },
          { name: '木兰县' },
          { name: '通河县' },
          { name: '延寿县' },
          { name: '尚志市' },
          { name: '五常市' }
        ]
      }
    ]
  },
  {
    name: '吉林省',
    children: [
      {
        name: '长春市',
        children: [
          { name: '南关区' },
          { name: '宽城区' },
          { name: '朝阳区' },
          { name: '二道区' },
          { name: '绿园区' },
          { name: '双阳区' },
          { name: '九台区' },
          { name: '农安县' },
          { name: '榆树市' },
          { name: '德惠市' }
        ]
      }
    ]
  },
  {
    name: '甘肃省',
    children: [
      {
        name: '兰州市',
        children: [
          { name: '城关区' },
          { name: '七里河区' },
          { name: '西固区' },
          { name: '安宁区' },
          { name: '红古区' },
          { name: '永登县' },
          { name: '皋兰县' },
          { name: '榆中县' }
        ]
      }
    ]
  },
  {
    name: '海南省',
    children: [
      {
        name: '海口市',
        children: [
          { name: '秀英区' },
          { name: '龙华区' },
          { name: '琼山区' },
          { name: '美兰区' }
        ]
      },
      {
        name: '三亚市',
        children: [
          { name: '海棠区' },
          { name: '吉阳区' },
          { name: '天涯区' },
          { name: '崖州区' }
        ]
      }
    ]
  },
  {
    name: '宁夏回族自治区',
    children: [
      {
        name: '银川市',
        children: [
          { name: '兴庆区' },
          { name: '西夏区' },
          { name: '金凤区' },
          { name: '永宁县' },
          { name: '贺兰县' },
          { name: '灵武市' }
        ]
      }
    ]
  },
  {
    name: '新疆维吾尔自治区',
    children: [
      {
        name: '乌鲁木齐市',
        children: [
          { name: '天山区' },
          { name: '沙依巴克区' },
          { name: '新市区' },
          { name: '水磨沟区' },
          { name: '头屯河区' },
          { name: '达坂城区' },
          { name: '米东区' },
          { name: '乌鲁木齐县' }
        ]
      }
    ]
  }
]

/**
 * 获取省份列表
 */
export const getProvinces = (): string[] => {
  return regionData.map(item => item.name)
}

/**
 * 根据省份名称获取城市列表
 */
export const getCitiesByProvince = (provinceName: string): string[] => {
  const province = regionData.find(item => item.name === provinceName)
  return province?.children?.map(item => item.name) || []
}

/**
 * 根据省市名称获取区县列表
 */
export const getDistrictsByCity = (provinceName: string, cityName: string): string[] => {
  const province = regionData.find(item => item.name === provinceName)
  const city = province?.children?.find(item => item.name === cityName)
  return city?.children?.map(item => item.name) || []
}
