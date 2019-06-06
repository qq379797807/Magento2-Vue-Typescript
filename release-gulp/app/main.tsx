import Vue, { CreateElement } from 'vue'
import { App } from './App'

Vue.config.productionTip = false

new Vue({
    el: '#app',
    components: {
        App
    }
})