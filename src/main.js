import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'

import '@/utils/window'
// Import custom icon
import '@/assets/iconfont/iconfont.css'
import '@/assets/fontFamily.css'
import store from './store'
import i18n from './i18n'

Vue.config.productionTip = false

new Vue({
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')

// set the language
i18n.locale = 'zh'