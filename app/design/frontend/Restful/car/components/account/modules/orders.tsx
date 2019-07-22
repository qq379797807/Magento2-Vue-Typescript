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
    public form_key: string = ''
    public uenc: string = ''
    public salesUrl: string = ''
    public recentOrders: any[] = []

    mounted () {
        this.init()
    }

    init () {
        let commonJson: any = window.commonJson
        let accountJson: any = window.accountJson
        this.form_key = commonJson.form_key
        this.uenc = commonJson.uenc
        this.salesUrl = accountJson.sales_url
        this.recentOrders = accountJson.rencent_orders
    }

    reOrder (url: string): void {
        const formTemplate = `
            <div class="in-form">
                <input name="form_key" value="${this.form_key}" />
                <input name="uenc" value="${this.uenc}" />
            </div>
        `
        let form = document.createElement('form')
        form.action = url
        form.method = 'post'
        form.enctype = 'multipart/form-data'
        form.innerHTML = formTemplate
        document.body.appendChild(form)
        form.submit()
    }

    priceFormat (price: string): string {
        const format: any = window.commonJson.priceFormat
        price = parseFloat(price).toFixed(format.precision)
        
        return format.pattern.replace('%s', price)
    }
}