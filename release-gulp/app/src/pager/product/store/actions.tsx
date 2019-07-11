import { ActionTree } from 'vuex'
import rest from '../../api/rest'

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
        let data: FormData = new FormData();

        for (const [key, value] of Object.entries(options)) {
            data.append(`${key}`, value)
        }

        let res: any = await rest.fetch(url, data)
        // commit('addToProduct', { item: 'exist', value: res })
    }
}

export default actions