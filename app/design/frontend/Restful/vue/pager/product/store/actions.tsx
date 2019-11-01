import { ActionTree } from 'vuex'

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
    }
}

export default actions