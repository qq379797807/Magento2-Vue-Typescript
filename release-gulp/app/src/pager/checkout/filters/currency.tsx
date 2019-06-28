import Vue from 'vue'

declare let window: any

Vue.filter('currency', (price: any) => {
    const format: any = window.config.basePriceFormat
    price = parseFloat(price).toFixed(2)
    return format.pattern.replace('%s', price)
})