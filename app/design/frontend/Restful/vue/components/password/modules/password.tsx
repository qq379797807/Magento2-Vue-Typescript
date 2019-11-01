import Vue from 'vue'
import Component from 'vue-class-component'

declare let window: any

@Component({
    name: 'v-password',
    data: () => ({
        i18n: {
            note: 'Please enter your email address below to receive a password reset link.',
            email: 'Email',
            captcha: 'Please type the letters and numbers below',
            reloadCaptcha: 'Reload captcha',
            resetPassword: 'Reset My Password'
        },
        email: '',
        captcha: '',
        password_action: '',
        captchaImg: '',
        refresh_url: '',
        captcha_type: ''
    })
})
export class VPassword extends Vue {
    public email: string = ''
    public captcha: string = ''
    public password_action: string = ''
    public captcha_img: string = ''
    public refresh_url: string = ''
    public captcha_type: string = ''
    
    mounted () {
        this.init()
    }

    init () {
        let passwordJson: any = window.passwordJson
        this.password_action = passwordJson.password_action
        this.captcha_img = passwordJson.captcha_img
        this.refresh_url = passwordJson.refresh_url
        this.captcha_type = passwordJson.captcha_type
    }
}