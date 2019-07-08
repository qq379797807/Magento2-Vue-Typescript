import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    name: 'v-totals',
    data: () => ({
        i18n: {
            discountTilte: 'Apply Discount Code',
            coupon: 'Enter discount code',
            applay: 'Apply Discount',
            cancelCoupon: 'Cancel Coupon'
        },
        coupon: ''
    })
})
export class VDiscount extends Vue {
    public coupon: string = ''
    
    mounted () {
        
    }
}