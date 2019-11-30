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
    }
}

export default actions