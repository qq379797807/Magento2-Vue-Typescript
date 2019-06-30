import Vue from 'vue'
import VueLazyload from 'vue-lazyload'
import { VApp } from './container/newsletter_index'

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
    components: {
        VApp
    }
})