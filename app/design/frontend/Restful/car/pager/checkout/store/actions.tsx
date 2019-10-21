import { ActionTree } from 'vuex'
import api from '../../api/api'

const actions: ActionTree<any, any> = {
    async validateEmail({ commit, getters }, email: string) {
        let url = `rest/${getters.storeCode}/V1/customers/isEmailAvailable`
        let data: any = {
            'customerEmail': email
        }
        
        let res: any = await api.post(url, data)
        commit('valideEmail', { item: 'exist', value: res })
    },
    placeOrder({ commit, state, getters }, billingAddress) {
        return new Promise((resolve, reject) => {
            let url = `guest-carts/${getters.cartId}/payment-information`
            if (getters.isCustomerLoggedIn) {
                url = 'carts/mine/payment-information'
            }

            billingAddress.country_id = billingAddress.country_id.value

            if (getters.regionsByCountryId(billingAddress.country_id).length) {
                billingAddress.region_id = billingAddress.region_id.value
                delete billingAddress.region
            } else {
                delete billingAddress.region_id
            }

            const data = {
                billingAddress,
                email: state.customer.email,
                paymentMethod: {
                    method: state.selectedPaymentMethod.code
                }
            }

            const options = {
                method: 'POST',
                data: JSON.stringify(data),
                url
            }
          
            commit('setItem', { item: 'step', value: 'success' })
        })
    }
}

export default actions