import { ActionTree } from 'vuex'

const actions: ActionTree<any, any> = {
    updateShippingMethods({ commit, getters }, countryId: any) {
        const data = {
            'address': {
                'country_id': countryId
            }
        }

        let url = `guest-carts/${getters.cartId}/estimate-shipping-methods`
        if (getters.isCustomerLoggedIn) {
            url = 'carts/mine/estimate-shipping-methods'
        }

        const options = {
            method: 'POST',
            data: JSON.stringify(data),
            url
        }

        // axios(options)
        //     .then(({ data }) => {
        //         commit('setItem', { item: 'shippingMethods', value: data })
        //     })
        //     .catch((error: any) => {
        //         console.log('Looks like there was a problem: \n', error)
        //     })
    },
    setShippinInformation({ commit, state, getters }) {
        return new Promise((resolve, reject) => {
            let url = `guest-carts/${getters.cartId}/shipping-information`
            if (getters.isCustomerLoggedIn) {
                url = 'carts/mine/shipping-information'
            }

            const shippingInformation = {
                addressInformation: {
                    shipping_method_code: state.selectedShippingMethod.method_code,
                    shipping_carrier_code: state.selectedShippingMethod.carrier_code
                }
            }

            state.billingAddress = state.shippingAddress
            const shippingAddress = { ...state.shippingAddress }
            shippingAddress.country_id = state.shippingAddress.country_id.value

            if (getters.regionsByCountryId(shippingAddress.country_id).length) {
                shippingAddress.region_id = state.shippingAddress.region_id.value
                delete shippingAddress.region
            } else {
                delete shippingAddress.region_id
            }

            // shippingInformation.addressInformation.shipping_address = shippingAddress
            // shippingInformation.addressInformation.billing_address = shippingAddress

            const options = {
                method: 'POST',
                data: JSON.stringify(shippingInformation),
                url
            }

            // axios(options)
            //     .then(({ data }) => {
            //         commit('setItem', { item: 'paymentMethods', value: data.payment_methods })
            //         commit('setItem', { item: 'step', value: 'payment' })
            //         resolve()
            //     })
            //     .catch(error => {
            //         console.error('Looks like there was a problem: \n', error)
            //     })
        })
    },
    manageDiscount({ getters }, discount) {
        return new Promise((resolve, reject) => {
            let url = `guest-carts/${getters.cartId}/coupons/`
            if (getters.isCustomerLoggedIn) {
                url = 'carts/mine/coupons/'
            }

            if (discount.method === 'PUT') {
                url += discount.code
            }

            const options = {
                method: discount.method,
                url
            }

            // axios(options)
            //     .then(response => {
            //         if (response.data) {
            //             resolve()
            //         }
            //     })
            //     .catch(error => {
            //         reject(error.request)
            //         console.log('Looks like there was a problem: \n', error)
            //     })
        })
    },
    getTotals({ commit, getters }) {
        return new Promise((resolve, reject) => {
            let url = `guest-carts/${getters.cartId}/totals/`
            if (getters.isCustomerLoggedIn) {
                url = 'carts/mine/totals/'
            }

            const options = {
                method: 'GET',
                url
            }

            // axios(options)
            //     .then(response => {
            //         if (response.data) {
            //             commit('setItem', { item: 'totals', value: response.data })
            //         }
            //     })
            //     .catch(error => {
            //         console.log('Looks like there was a problem: \n', error)
            //     })
        })
    }
}

export default actions