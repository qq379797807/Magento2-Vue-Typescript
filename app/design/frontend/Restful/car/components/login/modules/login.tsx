import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    name: 'v-login-form',
    data: () => ({
        i18n: {
            title: 'Registered Customers',
            note: 'If you have an account, sign in with your email address.',
            email: 'Email',
            password: 'Password',
            signIn: 'Sign In',
            forgot: 'Forgot Your Password?'
        },
        email: null,
        password: null
    })
})
export class VLoginForm extends Vue {
    mounted () {
        this.init()
    }

    init () {

    }
}