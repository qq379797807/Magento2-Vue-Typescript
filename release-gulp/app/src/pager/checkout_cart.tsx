import Vue from 'vue'
import { VApp } from './container/checkout_cart'

Vue.config.productionTip = false

new Vue({
    el: '#app',
    components: {
        VApp
    }
})