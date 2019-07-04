import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    name: 'v-create',
    data: () => ({
        i18n: {
            email: 'Email',
            password: 'Password',
            comfirm: 'Confirm Password',
            city: 'City',
            zip: 'Zip',
            button: 'Create an Account'
        },
        showEye: true,
        email: '',
        password: '',
        comfirm: '',
        city: '',
        postcode: ''
    })
})
export class VCreate extends Vue {
    public email: string = ''
    public password: string = ''
    public comfirm: string = ''
    public city: string = ''
    public postcode: string = ''

    mounted () {
        this.init()
    }

    init () {

    }
}