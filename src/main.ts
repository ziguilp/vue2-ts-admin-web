import Vue from 'vue'

import 'normalize.css'
import ElementUI from 'element-ui'
import SvgIcon from 'vue-svgicon'

import '@/styles/element-variables.scss'
import '@/styles/index.scss'

import App from '@/App.vue'
import store from '@/store'
import router from '@/router'
import '@/icons/components'
import '@/permission'
import './utils/number'
import { TurboConfirm } from './components/common/tubo-confirm'
import { TurboAudioTip } from './components/common/turbo-audio-tip'
import { Permission } from './components/common/permission'
import CustomList from './components/custom-list'

Vue.use(ElementUI)

Vue.use(CustomList)
Vue.use(TurboConfirm)
Vue.use(TurboAudioTip)
Vue.use(Permission, {
    store
})

Vue.use(SvgIcon, {
  tagName: 'svg-icon',
  defaultWidth: '1em',
  defaultHeight: '1em'
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
