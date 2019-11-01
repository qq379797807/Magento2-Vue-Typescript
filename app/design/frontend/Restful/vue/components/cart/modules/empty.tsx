import Vue from 'vue'
import Component from 'vue-class-component'

declare let window: any;

@Component({
    name: 'v-cart-empty',
    data: () => ({
        i18n: {
            noItem: 'You have no items in your shopping cart.',
            continue: 'Continue Shopping'
        },
        continueLink: ''
    })
})
export class VCartEmpty extends Vue {
    public continueLink: string = ''

    mounted () {
        this.init()
    }

    init () {
        let commonJson: any = window.commonJson
        this.continueLink = commonJson.minicart.baseUrl
    }
}