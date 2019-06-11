import Vue from 'vue'
import Component from 'vue-class-component'
import { VLoginForm } from './login'
import { VLoginCustomer } from './newcustomer'

@Component({
    name: 'v-login-container',
    data: () => ({
        title: 'login-container'
    }),
    components: {
        VLoginForm,
        VLoginCustomer
    }
})
export class VLoginContainer extends Vue {
    mounted () {
        this.init()
    }

    init () {

    }
}