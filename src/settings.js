module.exports = {
  title: '校园生活服务系统',
  /**
   * 侧边栏主题 深色主题theme-dark，浅色主题theme-light
   */
  sideTheme: 'theme-dark',

  // 上传图片接口
  // uploadUrl: process.env.NODE_ENV === 'development' ? '/dev-api/common/fileOperation/fileUpload' : '/common/fileOperation/fileUpload',
  // uploadUrl: '/common/upload',
  uploadUrl: process.env.VUE_APP_BASE_API + "/common/upload",

  // 图片域名
  picHead: 'https://project-test.obs.cn-east-2.myhuaweicloud.com/',

  /**
   * 是否系统布局配置
   */
  showSettings: false,

  /**
   * 是否显示顶部导航
   */
  topNav: false,

  /**
   * 是否显示 tagsView
   */
  tagsView: true,

  /**
   * 是否固定头部
   */
  fixedHeader: false,

  /**
   * 是否显示logo
   */
  sidebarLogo: true,

  /**
   * 是否显示动态标题
   */
  dynamicTitle: false,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production'
}
