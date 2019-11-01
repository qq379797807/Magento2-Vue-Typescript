import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    name: 'v-guest-form',
    data: () => ({
        i18n: {
            orderId: 'Order Id',
            billingName: 'Billing Last Name',
            email: 'Email',
            zip: 'Billing ZIP Code',
            continue: 'Continue',
            findOrder: 'Find Order By'
        }
    })
})
export class VGuestForm extends Vue {
    public orderId: string = ''
    public billingName: string = ''
    public email: string = ''
    public zip: string = ''
    public type: any[] = [
        { value: 'email', name: 'Email' },
        { value: 'zip', name: 'ZIP Code' }
    ]
    public selectType: string = ''

    mounted () {
        this.init()
    }

    init () {

    }
}