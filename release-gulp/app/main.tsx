import Vue from 'vue'

Vue.config.productionTip = false

new Vue({
    name: 'app',
    el: '#app',
    data: () => ({
        logoUrl: 'https://www.baidu.com'
    }),
    mounted () {
        this.init()
    },
    methods: {
        init () {
            console.log(`Magento2 App is bootstrap ...`)
        }   
    }
})