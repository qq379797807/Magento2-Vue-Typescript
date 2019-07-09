import { GetterTree } from 'vuex'

const getters: GetterTree<any, any> = {
    cartId: (state) => {
        return state.config.quoteData.entity_id
    },
    storeCode: (state) => {
        return state.config.storeCode
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
    addressByType: (state) => (type: any) => {
        const address = { ...state[type] }
        address.street0 = address.street.length ? address.street[0] : ''
        address.street1 = address.street.length ? address.street[1] : ''
        delete address.street
        return address
    },
    regionsByCountryId: (state) => (countryId: any) => {
        if (countryId === null) {
            return []
        } else {
            return state.regions.filter((region: any) => region.country_id === countryId)
        }
    },
    couponCode: (state) => {
        return state.totalsData.coupon_code !== null ? state.totalsData.coupon_code : ''
    },
    totalsData: (state) => {
        return state.totalsData
    }
}

export default getters