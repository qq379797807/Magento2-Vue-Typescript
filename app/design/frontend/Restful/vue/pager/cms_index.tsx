import Vue from 'vue'
import VueApollo from 'vue-apollo'
import VueLazyload from 'vue-lazyload'
import apolloOptions from './apollo/client'
import { VueBus, VueResize, VueCookies, VueCurrencyFilter, VFragment } from './tool'
import UI from '../components/ui'
import { VApp } from './container/cms_index'

const Lazyload: any = VueLazyload
const apolloProvider: any = new VueApollo({
   ...apolloOptions
})

Vue.config.productionTip = false
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
Vue.use(VueBus)
Vue.use(VueResize, {
    mobile: 640,
    tablet: 768,
    desktop: 1920
})
Vue.use(VueCookies)
Vue.use(VueCurrencyFilter, {
    symbol: window.commonJson.current_symbol,
    thousandsSeparator: ',',
    fractionCount: 2,
    fractionSeparator: '.'
})
Vue.component('v-fragment', VFragment)
UI.install(Vue)

new Vue({
    el: '#app',
    apolloProvider,
    components: {
        VApp
    }
})