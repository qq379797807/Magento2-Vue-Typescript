import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import Component from 'vue-class-component'

@Component({
    name: 'v-shipping',
    data: () => ({
        i18n: {
            item: 'Item',
            price: 'Price',
            qty: 'Qty',
            subtotal: 'Subtotal',
            operation: 'Operation',
            moveWishlist: 'Move Wishlist',
            remove: 'Remove Item'
        }
    }),
    computed: {
        ...mapState([
            'quoteItemData'
        ]),
        ...mapGetters([
            'priceFormat',
            'filterUrl'
        ])
    }
})
export class VShipping extends Vue {
    mounted () {
        this.init()
    }

    init () {

    }

    moveWishlist (item: any) {
        console.log(item)
    }

    removeItem (item: any) {
        console.log(item)
    }
}