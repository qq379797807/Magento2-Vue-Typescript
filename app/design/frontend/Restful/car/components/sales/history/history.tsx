import Vue from 'vue'
import Component from 'vue-class-component'

declare let window: any

@Component({
    name: 'v-order-history',
    data: () => ({
        i18n: {
            order: 'Order #',
            date: 'Date',
            shipTo: 'Ship To',
            orderTotal: 'Order Total',
            status: 'Status',
            action: 'Action',
            viewOrder: 'View Order',
            reOrder: 'ReOrder',
            noOrder: 'You have placed no orders.'
        }
    })
})
export class VOrderHistory extends Vue {
    public historyOrder: any[] = []

    mounted () {
        this.init()
    }

    init () {
        let historyJson: any = window.historyJson
        this.historyOrder = historyJson.history_order
    }

    reOrder (id: string): void {
        console.log(id)
    }

    priceFormat (price: string): string {
        const format: any = window.commonJson.priceFormat
        price = parseFloat(price).toFixed(format.precision)
        
        return format.pattern.replace('%s', price)
    }
}