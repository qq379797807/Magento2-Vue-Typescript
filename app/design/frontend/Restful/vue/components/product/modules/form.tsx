import Vue from 'vue'
import { mapState, mapMutations } from 'Vuex'
import Component from 'vue-class-component'
import { VProductOptions } from './options'
import { addSimpleCart } from '../../queries/addSimpleCart.gql'

declare let window: any

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
            'cartId',
            'productId',
            'defaultQty',
            'productPrices'
        ])
    },
    methods: {
        ...mapMutations([
            'changeQty'
        ])
    }
})
export class VProductForm extends Vue {
    public qty: number = 1
    public sku: string = ''

    mounted () {
        this.init()
    }

    init () {
        let productJson: any = window.productJson
        this.qty = this.defaultQty
        this.sku = productJson.product_sku
    }

    qtyChange () {
        const tierPrices: any = this.productPrices.tierPrices
        if (tierPrices.length > 0) this.changeQty(this.qty)
    }

    async addCart () {
        const result: any = await this.$apollo.mutate({
            mutation: addSimpleCart,
            variables: {
                cart_id: this.cartId,
                quantity: this.qty,
                sku: this.sku
            }
        })

        console.log(result)
    }
}