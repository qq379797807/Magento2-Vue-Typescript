import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

declare let window: any

Vue.use(Vuex)

const store: Store<any> = new Vuex.Store({
    state: {
        config: window.checkoutJson,
        baseUrl: window.baseUrl,
        customer: null,
        step: 'shipping',
        orderId: null,
        shippingMethods: [],
        selectedShippingMethod: null,
        selectedPaymentMethod: null,
        shippingAddress: null,
        billingAddress: null,
        newBillingAddress: null,
        paymentMethods: [],
        totals: null
    },
    actions,
    mutations,
    getters,
    modules: {}
})

export default store