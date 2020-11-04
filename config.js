
//测试环境
const DevConfig = {
  Host: 'https://www.52yifu.wang/cloud-wxcx/',
  Upyun: 'https://www.measures.wang/',
  PayHost: "https://www.52yifu.wang/cloud-pay/",
  Version: '&version=V1.31&channel=68&app_id=wx79b8d262f2563c52',
  VersionPost: 'V1.31',
  ChannelPost: '68',
}

// 正式环境
const ProdConfig = {
  Host: 'https://www.52yifu.com/cloud-wxcx/',
  Upyun: 'https://www.incursion.wang/',
  PayHost: "https://www.52yifu.com/cloud-pay/",
  Version: '&version=V1.31&channel=68&app_id=wxc211367f634ba3e9',
  VersionPost: 'V1.31',
  ChannelPost: '68',
}

var Config = {
  Host: '',
  Upyun: '',
  Version: '',
}

var systemInfo;
if (!systemInfo) {
  systemInfo = wx.getSystemInfoSync();
}

// 判断是否为电脑开发
if (systemInfo.platform === 'devtools') {
  // Config = DevConfig;
  Config = ProdConfig;
}
else {
  Config = ProdConfig;
  // Config = DevConfig;
}

export default Config;