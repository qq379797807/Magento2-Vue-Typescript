import { MutationTree } from 'vuex'

const mutations: MutationTree<any> = {
    addToProduct (state, payload) {
        const { item, value } = payload
        state[item] = value
    }
}

export default mutations