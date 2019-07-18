import Vue from 'vue'
import { mapState, mapMutations, mapActions } from 'Vuex'
import Component from 'vue-class-component'
import { VProductOptions } from './options'

@Component({
    name: 'v-product-form',
    data: () => ({
        i18n: {
            qty: 'Qty',
            buttonTitle: 'Add to Cart'
        }
    }),
    components: {
        VProductOptions
    },
    computed: {
        ...mapState([
            'productId',
            'defaultQty',
            'productPrices'
        ])
    },
    methods: {
        ...mapMutations([
            'changeQty'
        ]),
        ...mapActions([
            'addToProduct'
        ])
    }
})
export class VProductForm extends Vue {
    public qty: number = 1

    mounted () {
        this.init()
    }

    init () {
        this.qty = this.defaultQty
    }

    qtyChange () {
        const tierPrices: any = this.productPrices.tierPrices
        if (tierPrices.length > 0) this.changeQty(this.qty)
    }

    addCart () {
        this.addToProduct({
            product: this.productId,
            item: this.productId,
            qty: this.qty,
            selected_configurable_option: '',
            related_product: ''
        })
    }
}