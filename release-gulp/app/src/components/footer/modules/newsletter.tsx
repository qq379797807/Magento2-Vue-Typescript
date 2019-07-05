import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    name: 'v-newsletter',
    data: () => ({
        i18n: {
            email_address: 'Enter your email address',
            subscribe: 'Subscribe'
        },
        email: ''
    })
})
export class VNewsletter extends Vue {
    public email: string = ''

    mounted () {
        this.init()
    }
    
    init () {

    }
}