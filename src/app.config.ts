export default {
  pages: [
    'pages/login/index',
    'pages/home/index',
    'pages/home/data/community-select/index',
    'pages/joy/index',
    'pages/joy/components/CommunityActivity/index',
    'pages/joy/components/CommunityActivity/Detail/index',
    'pages/joy/components/CommunityActivity/Registration/index',
    'pages/joy/components/CommunityActivity/MapView/index',
    'pages/joy/components/ElderlyMall/index',
    'pages/joy/components/ElderlyMall/Detail/index',
    'pages/joy/components/HomeService/index',
    'pages/joy/components/HomeService/Detail/index',
    'pages/care/index',
    'pages/care/data/consultation/index',
    'pages/profile/index',
    'pages/login/agreement/index',
    'pages/login/privacy/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '晚晴',
    navigationBarTextStyle: 'black'
  },
  requiredPrivateInfos: ['getLocation'],
  permission: {
    'scope.userLocation': {
      desc: '您的位置信息将用于提供周边服务'
    }
  },
  // 预下载配置 - 显著提升页面切换速度
  preloadRule: {
    'pages/home/index': {
      network: 'all',
      packages: ['pages/joy', 'pages/care']
    },
    'pages/joy/index': {
      network: 'all',
      packages: ['pages/home', 'pages/care']
    }
  },
  tabBar: {
    color: '#999',
    selectedColor: '#ff9800',
    backgroundColor: '#fff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页',
        iconPath: 'assets/images/icons/icon-home.png',
        selectedIconPath: 'assets/images/icons/icon-home-active.png'
      },
      {
        pagePath: 'pages/joy/index',
        text: '乐享',
        iconPath: 'assets/images/icons/icon-joy.png',
        selectedIconPath: 'assets/images/icons/icon-joy-active.png'
      },
      {
        pagePath: 'pages/care/index',
        text: '颐养',
        iconPath: 'assets/images/icons/icon-care.png',
        selectedIconPath: 'assets/images/icons/icon-care-active.png'
      },
      {
        pagePath: 'pages/profile/index',
        text: '个人',
        iconPath: 'assets/images/icons/icon-profile.png',
        selectedIconPath: 'assets/images/icons/icon-profile-active.png'
      }
    ]
  }
}
