import Vue from 'vue'
import Component from 'vue-class-component'
import { generateToken } from '../../queries/generateToken.gql'

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
        }
    })
})
export class VLoginForm extends Vue {
    public showEye: boolean = true
    public email: string = ''
    public password: string = ''
    public post_action: string = ''
    public forgot_url: string = ''
    public modalMsg: string = ''
    public visible: boolean = false
    
    mounted () {
        this.init()
    }

    init () {
        let loginJson: any = window.loginJson
        this.post_action = loginJson.post_action
        this.forgot_url = loginJson.forgot_url
    }

    _login () {
        const loginForm: any = this.$refs.loginForm

        loginForm.validate(() => {
            this.$apollo.mutate({
                mutation: generateToken,
                variables: {
                    email: this.email,
                    password: this.password
                }
            }).then((response: any) => {
                const token: string = response.data.generateCustomerToken.token

                window.localStorage.setItem('access_token', token)
                window.location.href = `${window.commonJson.base_url}customer/account/`
            }).catch((error: any) => {
                this.modalMsg = error
                this.visible = true
            })
        })
    }
}