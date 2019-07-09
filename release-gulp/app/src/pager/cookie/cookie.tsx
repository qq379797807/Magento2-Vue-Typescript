import Vue from 'vue'
const VueCookies = require('vue-cookies')

declare let window: any

VueCookies.set('form_key', window.commonJson.form_key)
Vue.use(VueCookies)