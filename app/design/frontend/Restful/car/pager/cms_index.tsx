import Vue from 'vue'
import { VApp } from './container/cms_index'

Vue.config.productionTip = false

new Vue({
    el: '#app',
    components: {
        VApp
    }
})