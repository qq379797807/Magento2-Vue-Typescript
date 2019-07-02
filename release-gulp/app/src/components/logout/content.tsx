import Vue from 'vue'
import Component from 'vue-class-component'
import { VTitle } from '../title/title'
import { VMessage } from '../message/message'

declare let window: any

@Component({
    name: 'v-content',
    data: () => ({
        i18n: {
            logout: 'You have signed out and will go to our homepage in 5 seconds.'
        },
        redirectUrl: ''
    }),
    components: {
        VTitle,
        VMessage
    }
})
export class VContent extends Vue {
    public redirectUrl: string = ''

    mounted () {
        this.init()
    }

    init () {
        let commonJson: any = window.commonJson
        this.redirectUrl = commonJson.base_url

        setTimeout(() => {
            window.location.href = this.redirectUrl
        }, 5000)
    }
}