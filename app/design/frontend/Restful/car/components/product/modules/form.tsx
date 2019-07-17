import Vue from 'vue'
import { mapState ,mapActions } from 'Vuex'
import Component from 'vue-class-component'
import { VProductOptions } from './options'

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
            'productId'
        ])
    },
    methods: {
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
        let productJson: any = window.productJson
        this.qty = productJson.default_qty
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