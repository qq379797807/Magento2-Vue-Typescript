import Vue from 'vue'
import Component from 'vue-class-component'
import { VTitle } from '../title/title'
import { VMessage } from '../message/message'

declare let window: any

@Component({
    name: 'v-content',
    data: () => ({
        i18n: {
            addAddress: 'Add Address'
        }
    }),
    components: {
        VTitle,
        VMessage
    }
})
export class VContent extends Vue {
    public newUrl: string = ''

    mounted () {
        this.init()
    }

    init () {
        let addressJson: any = window.addressJson
        this.newUrl = addressJson.new_url
    }

    addAddress () {
        window.location.href = this.newUrl
    }
}