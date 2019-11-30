import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import VueLazyload from 'vue-lazyload'
import VueNotifications from 'vue-notification'
import { VueBus, VueResize } from './tool'
import UI from '../components/ui'
import storeOption from './checkout/store'
import { VApp } from './container/checkout_index'

const Lazyload: any = VueLazyload

Vue.config.productionTip = false
Vue.use(Vuex)
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
Vue.use(VueNotifications)
UI.install(Vue)

const store: Store<any> = new Vuex.Store({
    ...storeOption
})

new Vue({
    el: '#app',
    store,
    components: {
        VApp
    }
})