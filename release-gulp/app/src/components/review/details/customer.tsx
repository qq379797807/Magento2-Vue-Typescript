import Vue from 'vue'
import Component from 'vue-class-component'

declare let window: any

@Component({
    name: 'v-customer-review',
    data: () => ({
        i18n: {
            average: 'Average Customer Rating',
            yourReview: 'Your Review',
            return: 'Back To Reviews'
        }
    })
})
export class VCustomerReview extends Vue {
    public productId: string = ''
    public productUrl: string = ''
    public productName: string = ''
    public reviewTitle: string = ''
    public reviewData: any[] = []
    public reviewDetail: string = ''
    public reviewHtml: string = ''
    public reviewTime: string = ''
    public backUrl: string = ''

    mounted () {
        this.init()
    }

    init () {
        let detailsJson: any = window.detailsJson
        this.productId = detailsJson.product_id
        this.productUrl = detailsJson.product_url
        this.productName = detailsJson.product_name
        this.reviewTitle = detailsJson.review_title
        this.reviewData = detailsJson.review_data
        this.reviewDetail = detailsJson.review_detail
        this.reviewHtml = detailsJson.review_html
        this.reviewTime = detailsJson.review_time
        this.backUrl = detailsJson.backUrl
    }
}