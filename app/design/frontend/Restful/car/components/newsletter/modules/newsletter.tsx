import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    name: 'v-account-newsletter',
    data: () => ({
        i18n: {
            subscription: 'Subscription option',
            general: 'General Subscription',
            save: 'Save'
        }
    })
})
export class VAccountNewsletter extends Vue {
    public subscribed: boolean = false

    mounted () {
        this.init()
    }

    init () {

    }
}