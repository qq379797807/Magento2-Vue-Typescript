declare let window: any

const commonJson = window.commonJson
const checkoutJson = window.checkoutJson

const state: any = {
    config: checkoutJson,
    baseUrl: commonJson.base_url,
    countries: checkoutJson.country,
    customerData: checkoutJson.customerData,
    quoteItemData: checkoutJson.quoteItemData,
    shippingMethods: checkoutJson.shippingMethods,
    selectedShippingMethod: null,
    paymentMethods: checkoutJson.paymentMethods,
    selectedPaymentMethod: null,
    shippingAddress: null,
    billingAddress: null,
    totalsData: checkoutJson.totalsData,
    postCodes: checkoutJson.postCodes
}

export default state