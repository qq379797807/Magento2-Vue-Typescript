import Vue from 'vue'
import { VApp } from './container/cms_page'

Vue.config.productionTip = false

new Vue({
    el: '#app',
    components: {
        VApp
    }
})