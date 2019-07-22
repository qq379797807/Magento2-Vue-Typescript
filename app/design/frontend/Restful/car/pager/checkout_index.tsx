import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import VueLazyload from 'vue-lazyload'
import { VueBus, VueResize } from './tool'
import UI from '../components/ui'
import './cookie/cookie'
import state from './checkout/store/state'
import getters from './checkout/store/getters'
import actions from './checkout/store/actions'
import mutations from './checkout/store/mutations'
import { VApp } from './container/checkout_index'

const Lazyload: any = VueLazyload

Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(Lazyload.install, {
    preLoad: 1.3,
    error: '',
    loading: '',
    attempt: 1,
    listenEvents: [
        'scroll'
    ]
})
Vue.use(VueBus)
Vue.use(VueResize, {
    mobile: 640,
    tablet: 768,
    desktop: 1200
})
UI.install(Vue)

const store: Store<any> = new Vuex.Store({
    state: state,
    getters,
    actions,
    mutations,
    modules: {}
})

new Vue({
    el: '#app',
    store,
    components: {
        VApp
    }
})