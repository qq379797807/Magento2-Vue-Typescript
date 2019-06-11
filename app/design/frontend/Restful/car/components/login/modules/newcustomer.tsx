import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    name: 'v-login-customer',
    data: () => ({
        i18n: {
            title: 'New Customers',
            msg: 'Creating an account has many benefits: check out faster, keep more than one address, track orders and more.',
            button: 'Create an Account'
        }
    })
})
export class VLoginCustomer extends Vue {
    mounted () {
        this.init()
    }

    init () {

    }
}