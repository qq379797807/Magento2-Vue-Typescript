import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    name: 'v-contact-form',
    data: () => ({
        i18n: {
            name: 'Name',
            email: 'Email',
            telephone: 'Phone Number',
            comment: 'What’s on your mind?',
            submit: 'Submit'
        },
        auto: true
    })
})
export class VContactForm extends Vue {
    public name: string = ''
    public email: string = ''
    public telephone: string = ''
    public comment: string = '' 

    mounted () {
        this.init()
    }

    init () {

    }
}