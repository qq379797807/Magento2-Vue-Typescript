import { MutationTree } from 'vuex'

const mutations: MutationTree<any> = {
    chooseOption (state, payload) {
        state.productGrallery = payload
    },
    addToProduct (state, payload) {
        const { item, value } = payload
        state[item] = value
    }
}

export default mutations