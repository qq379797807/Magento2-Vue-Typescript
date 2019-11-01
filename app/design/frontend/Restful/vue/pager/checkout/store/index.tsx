import { StoreOptions } from 'vuex'
import state from './state'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const storeOption: StoreOptions<any> = {
    state: state,
    getters,
    actions,
    mutations,
    modules: {}
}

export default storeOption