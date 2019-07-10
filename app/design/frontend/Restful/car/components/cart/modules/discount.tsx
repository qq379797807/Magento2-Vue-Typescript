import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    name: 'v-totals',
    data: () => ({
        i18n: {
            coupon: 'Enter discount code',
            applay: 'Apply'
        },
        coupon: ''
    })
})
export class VDiscount extends Vue {
    public coupon: string = ''
    
    mounted () {
        
    }
}