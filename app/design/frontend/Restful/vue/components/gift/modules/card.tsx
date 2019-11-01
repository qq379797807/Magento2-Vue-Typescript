import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    name: 'v-gift-card',
    data: () => ({
        i18n: {
            giftCode: 'Enter gift card code',
            removeGift: 'Redeem Gift Card',
            checkGift: 'Check status and balance'
        }
    })
})
export class VGiftCard extends Vue {
    public giftCode: string

    constructor () {
        super()
        this.giftCode = ''
    }

    removeGift (): void {
        console.warn(this.giftCode)
    }

    checkGift (): void {
        console.info(this.giftCode)
    }
}