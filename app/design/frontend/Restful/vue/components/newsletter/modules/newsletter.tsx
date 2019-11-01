import Vue from 'vue'
import Component from 'vue-class-component'

declare let window: any

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
    public action: string = ''
    public subscribed: boolean = false

    mounted () {
        this.init()
    }

    init () {
        let newsletterJson: any = window.newsletterJson
        this.action = newsletterJson.action
        this.subscribed = newsletterJson.isSubscribed
    }
}