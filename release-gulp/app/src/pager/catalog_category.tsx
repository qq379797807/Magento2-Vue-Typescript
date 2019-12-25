import Vue from 'vue'
import Vuex from 'vuex'
import VueApollo from 'vue-apollo'
import VueLazyload from 'vue-lazyload'
import InfiniteLoading from 'vue-infinite-loading'
import apolloOptions from './apollo/client'
import { VueBus, VueResize, VueCurrencyFilter, VFragment, URLParam } from './tool'
import UI from '../components/ui'
import storeOption from './category/store'
import { VApp } from './container/catalog_category'

const Lazyload: any = VueLazyload
const InfiniteScroll: any = InfiniteLoading
const apolloProvider: any = new VueApollo({
    ...apolloOptions
 })

Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(VueApollo)
Vue.use(Lazyload.install, {
    preLoad: 1.3,
    error: '',
    loading: '',
    attempt: 1,
    listenEvents: [
        'scroll'
    ]
})
Vue.use(InfiniteScroll, {
    props: {
        spinner: 'bubbles',
        distance: 500,
        forceUseInfiniteWrapper: true
    },
    system: {
        throttleLimit: 50
    },
    slots: {
        noResults: `No more produts ...`,
        noMore: `No more produts ...`
    }
})
Vue.use(VueBus)
Vue.use(VueResize, {
    mobile: 640,
    tablet: 768,
    desktop: 1200
})
Vue.use(VueCurrencyFilter, {
    symbol: window.commonJson.current_symbol,
    thousandsSeparator: ',',
    fractionCount: 2,
    fractionSeparator: '.'
})
Vue.component('v-fragment', VFragment)
Vue.prototype.$url = URLParam
UI.install(Vue)

const store: any = new Vuex.Store({
    ...storeOption
})
store.$apollo = apolloOptions

new Vue({
    el: '#app',
    store,
    apolloProvider,
    components: {
        VApp
    }
})