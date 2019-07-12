import { GetterTree } from 'vuex'

declare let window: any
const cartJson = window.cartJson

const getters: GetterTree<any, any> = cartJson ? {
    cartId: (state) => {
        return state.config.quoteData.entity_id
    },
    currencyCode: (state) => {
        return state.totalsData.base_currency_code
    },
    priceFormat: (state) => (price: string) => {
        const format: any = state.config.basePriceFormat
        price = parseFloat(price).toFixed(format.precision)
        return format.pattern.replace('%s', price)
    },
    filterUrl: (state) => (item: any) => {
        const product = item.product
        return `${state.baseUrl}${product.request_path}`
    },
    regionsByCountryId: (state) => (countryId: any) => {
        if (countryId === null) {
            return []
        } else {
            return state.regions.filter((region: any) => region.country_id === countryId)
        }
    },
    totalsData: (state) => {
        return state.totalsData
    }
} : {}

export default getters