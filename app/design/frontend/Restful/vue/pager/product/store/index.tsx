import { StoreOptions } from 'vuex'
import state from './state'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import vuexPersisted from './persist'

const storeOption: StoreOptions<any> = {
    state: state,
    getters,
    actions,
    mutations,
    plugins: [
        vuexPersisted
    ],
    modules: {}
}

export default storeOption