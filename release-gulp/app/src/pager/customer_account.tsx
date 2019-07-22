import Vue from 'vue'
import VueLazyload from 'vue-lazyload'
import { VueBus, VueResize } from './tool'
import UI from '../components/ui'
import { VApp } from './container/customer_account'

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
UI.install(Vue)

new Vue({
    el: '#app',
    components: {
        VApp
    }
})