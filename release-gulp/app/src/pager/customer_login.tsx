import Vue from 'vue'
import { VApp } from './container/customer_login'

Vue.config.productionTip = false

new Vue({
    el: '#app',
    components: {
        VApp
    }
})