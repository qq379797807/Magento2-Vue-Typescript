import { GetterTree } from 'vuex'

const getters: GetterTree<any, any> = {
    postAction: (state) => {
        return state.productAction
    }
}

export default getters