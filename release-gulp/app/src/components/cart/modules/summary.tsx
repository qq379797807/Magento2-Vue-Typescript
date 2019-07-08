import Vue from 'vue'
import { mapState } from 'vuex'
import Component from 'vue-class-component'
import { VEstimate } from './estimate'
import { VTotals } from './totals'
import { VDiscount } from './discount'

@Component({
    name: 'v-summary',
    data: () => ({
        i18n: {
            checkout: 'Proceed to Checkout'
        }
    }),
    components: {
        VEstimate,
        VTotals,
        VDiscount
    },
    computed: {
        ...mapState([
            'baseUrl'
        ])
    }
})
export class VSummary extends Vue {
    goCheckout () {
        window.location.href = `${this.baseUrl}checkout`
    }
}