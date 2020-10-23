let path = require('path')
function resolve(dir) {
    return path.join(__dirname, dir)
}
module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/LuckyBabylonDemo/'
    : '/',
    chainWebpack: config => {
        config.resolve.alias
            .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
    },

    lintOnSave: false,

    pluginOptions: {
      i18n: {
        locale: 'en',
        fallbackLocale: 'en',
        localeDir: 'locales',
        enableInSFC: false
      }
    }
}