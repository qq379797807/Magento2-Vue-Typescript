import Vue from 'vue'
import Component from 'vue-class-component'

declare let window: any

@Component({
    name: 'v-account-orders',
    data: () => ({
        i18n: {
            recentOrders: 'Recent Orders',
            viewAll: 'View All',
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
export class VAccountOrders extends Vue {
    public salesUrl: string = ''
    public recentOrders: any[] = []

    mounted () {
        this.init()
    }

    init () {
        let accountJson: any = window.accountJson
        this.salesUrl = accountJson.sales_url
        this.recentOrders = accountJson.rencent_orders
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