import Vue from 'vue'
import VueLazyload from 'vue-lazyload'
import { VApp } from './container/cms_index'
const SocialSharing = require('vue-social-sharing')

const Lazyload: any = VueLazyload

Vue.config.productionTip = false
Vue.use(SocialSharing)
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