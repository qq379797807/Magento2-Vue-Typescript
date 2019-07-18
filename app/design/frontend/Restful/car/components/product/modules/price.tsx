import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import Component from 'vue-class-component'

@Component({
    name: 'v-product-price',
    data: () => ({
        title: 'price'
    }),
    computed: {
        ...mapState([
            'tierPrice'
        ]),
        ...mapGetters([
            'prices',
            'priceFormat'
        ])
    }
})
export class VProductPrice extends Vue {
    public hasSpecial: boolean = false
    public hasTier: boolean = false

    get basePrice () {
        return this.prices.basePrice
    }

    get oldPrice () {
        return this.prices.oldPrice
    }

    get finalPrice () {
        return this.prices.finalPrice
    }

    get tierPrices () {
        return this.prices.tierPrices
    }

    mounted () {
        this.init()
    }

    init () {
        this.hasSpecial = this.oldPrice.amount == this.finalPrice.amount
    }
}