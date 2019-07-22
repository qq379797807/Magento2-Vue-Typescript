import Vue from 'vue'
import VueLazyload from 'vue-lazyload'
import { VApp } from './container/customer_login'
import { VContentLoader } from './loader/loader'
import VueBus from './tool/bus'
import VueResize from './tool/resize'
import UI from '../components/ui'

const Lazyload: any = VueLazyload
Vue.config.productionTip = false
Vue.use(Lazyload.install, {
    preLoad: 1.3,
    error: '',
    loading: '',
    attempt: 1,
    listenEvents: [
        'scroll'
    ]
})
Vue.use(VueBus)
Vue.use(VueResize, {
    mobile: 640,
    tablet: 768,
    desktop: 1200
})
Vue.component('v-content-loader', VContentLoader)
UI.install(Vue)

new Vue({
    el: '#app',
    components: {
        VApp
    }
})