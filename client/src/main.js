import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './store'
import { dictionary } from './utils'
import {socket} from './store/socket'

import VModal from 'vue-js-modal'
Vue.use(VModal)

import vueDebounce from 'vue-debounce'
Vue.use(vueDebounce)


import Croppa from 'vue-croppa'
Vue.use(Croppa)


import VeeValidate from 'vee-validate'
import { Validator } from 'vee-validate'

Validator.localize(dictionary)
Vue.use(VeeValidate)
const validator = new Validator()
validator.localize('ru')

Vue.config.productionTip = false

Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})


new Vue({
  router,
  store,
  socket,
  render: h => h(App)
}).$mount('#app')
