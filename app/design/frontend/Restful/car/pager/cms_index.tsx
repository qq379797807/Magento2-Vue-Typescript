import Vue from 'vue'
import { VApp } from './container/cms_index'
const SocialSharing = require('vue-social-sharing')

Vue.config.productionTip = false
Vue.use(SocialSharing)

new Vue({
    el: '#app',
    components: {
        VApp
    }
})