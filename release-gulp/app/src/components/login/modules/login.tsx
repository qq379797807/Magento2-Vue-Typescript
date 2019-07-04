import Vue from 'vue'
import Component from 'vue-class-component'

declare let window: any

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
        showEye: true,
        email: null,
        password: null,
        post_action: '',
        forgot_url: ''
    })
})
export class VLoginForm extends Vue {
    public post_action: string = ''
    public forgot_url: string = ''
    
    mounted () {
        this.init()
    }

    init () {
        let loginJson: any = window.loginJson
        this.post_action = loginJson.post_action
        this.forgot_url = loginJson.forgot_url
    }
}