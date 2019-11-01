import { GetterTree } from 'vuex'

const getters: GetterTree<any, any> = {
    priceFormat: (state) => (price: string) => {
        const format: any = state.config.priceFormat
        price = parseFloat(price).toFixed(format.precision)
        return format.pattern.replace('%s', price)
    },
    grallery: (state) => {
        return state.productGrallery.length > 0 ? state.productGrallery : state.data.product_grallery
    },
    prices: (state) => {
        return state.productPrices !== null ? state.productPrices : state.data.prices
    },
    postAction: (state) => {
        return state.productAction
    }
}

export default getters