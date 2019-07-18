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
    chooseOption ({ commit, state }, params: any) {
        let activeIndex: number = 0
        const { key, optId } = params
        const index: any = state.configurable.index;
        const images: any = state.configurable.images;

        Object.keys(index).map((ids: any) => {
            const item: any = index[ids]
            if (item.hasOwnProperty(key) && item[key] === optId) {
                activeIndex = ids
            }
        })
        
        commit('chooseOption', images[activeIndex])
    },
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