import { GetterTree } from 'vuex'

const getters: GetterTree<any, any> = {
    grallery: (state) => {
        return state.productGrallery.length > 0 ? state.productGrallery : state.data.product_grallery
    },
    postAction: (state) => {
        return state.productAction
    }
}

export default getters