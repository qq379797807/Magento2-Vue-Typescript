import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    name: 'v-create',
    data: () => ({
        i18n: {
            email: 'Email',
            password: 'Password',
            comfirm: 'Confirm Password',
            button: 'Create an Account'
        },
        showEye: true,
        email: '',
        password: '',
        comfirm: ''
    })
})
export class VCreate extends Vue {
    public email: string = ''
    public password: string = ''
    public comfirm: string = ''

    mounted () {
        this.init()
    }

    init () {

    }
}