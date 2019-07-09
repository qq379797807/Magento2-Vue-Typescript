import Vue from 'vue'
import Component from 'vue-class-component'

declare let window: any

@Component({
    name: 'v-reviews',
    data: () => ({
        i18n: {
            create: 'Created',
            name: 'Product Name',
            rating: 'Rating',
            review: 'Review',
            operation: 'Operation',
            seeDetail: 'See Details'
        },
        reviewData: []
    })
})
export class VReviews extends Vue {
    public reviewData: any[] = []

    mounted () {
        this.init()
    }

    init () {
        let reviewJson: any = window.reviewJson
        this.reviewData = reviewJson.reviews
    }
}