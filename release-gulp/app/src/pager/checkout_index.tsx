import Vue from 'vue'
import * as VueLazyload from 'vue-lazyload'
import { VApp } from './container/checkout_index'
import store from './checkout/store'

declare let window: any
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

new Vue({
    el: '#app',
    store,
    components: {
        VApp
    }
})