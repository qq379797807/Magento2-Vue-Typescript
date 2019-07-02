declare let window: any

const state: any = {
    config: window.checkoutJson,
    baseUrl: window.commonJson.base_url,
    customer: null,
    orderId: null,
    shippingMethods: [],
    selectedShippingMethod: null,
    selectedPaymentMethod: null,
    shippingAddress: null,
    billingAddress: null,
    newBillingAddress: null,
    paymentMethods: [],
    totals: null
}

export default state