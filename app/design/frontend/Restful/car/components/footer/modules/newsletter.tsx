import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    name: 'v-newsletter',
    data: () => ({
        i18n: {
            emailAddress: 'Enter your email address',
            subscribe: 'Subscribe'
        },
        email: ''
    })
})
export class VNewsletter extends Vue {
    mounted () {
        this.init()
    }
    
    init () {

    }
}