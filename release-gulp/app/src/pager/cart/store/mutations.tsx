import { MutationTree } from 'vuex'

const mutations: MutationTree<any> = {
    setItem(state, { item, value }) {
        state[item] = value
    }
}

export default mutations