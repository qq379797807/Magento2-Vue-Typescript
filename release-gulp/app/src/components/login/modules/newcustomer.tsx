import Vue from 'vue'
import Component from 'vue-class-component'

declare let window: any

@Component({
    name: 'v-login-customer',
    data: () => ({
        i18n: {
            createTitle: 'New Customers',
            createMsg: 'Creating an account has many benefits: check out faster, keep more than one address, track orders and more.',
            createButton: 'Create an Account'
        },
        create_url: ''
    })
})
export class VLoginCustomer extends Vue {
    public create_url: string = ''

    mounted () {
        this.init()
    }

    init () {
        let loginJson: any = window.loginJson
        this.create_url = loginJson.create_url
    }
}