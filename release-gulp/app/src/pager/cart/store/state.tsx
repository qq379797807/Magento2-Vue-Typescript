const commonJson: any = window.commonJson
const cartJson: any = window.cartJson

const state: any = Object.keys(cartJson).length > 0 ? {
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