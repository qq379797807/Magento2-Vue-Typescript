declare let window: any

const commonJson = window.commonJson
const cartJson = window.cartJson

const state: any = cartJson ? {
    config: cartJson,
    baseUrl: commonJson.base_url,
    countries: cartJson.country,
    customerData: cartJson.customerData,
    quoteItemData: cartJson.quoteItemData,
    shippingMethods: [],
    selectedShippingMethod: null,
    paymentMethods: [],
    selectedPaymentMethod: null,
    shippingAddress: null,
    billingAddress: null,
    totalsData: cartJson.totalsData,
    postCodes: cartJson.postCodes
} : {}

export default state