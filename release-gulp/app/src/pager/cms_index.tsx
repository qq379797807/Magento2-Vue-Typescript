import Vue from 'vue'
import VueApollo from 'vue-apollo'
import VueLazyload from 'vue-lazyload'
import apolloOptions from './apollo/client'
import { VueBus, VueResize } from './tool'
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
    desktop: 1200
})
UI.install(Vue)

new Vue({
    el: '#app',
    apolloProvider,
    components: {
        VApp
    }
})