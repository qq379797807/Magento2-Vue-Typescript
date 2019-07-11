import { ActionTree } from 'vuex'
import api from '../../api/api'

interface ProductParams {
    product: string,
    item: string,
    qty: number,
    selected_configurable_option?: any,
    related_product?: any
}

const actions: ActionTree<any, any> = {
    async addToProduct ({ commit, getters }, options: ProductParams) {
        let url = `${getters.postAction}`
        let data: any = Object.assign({}, options)
        
        let res: any = await api.post(url, data)
        console.log(res)
        // commit('addToProduct', { item: 'exist', value: res })
    }
}

export default actions