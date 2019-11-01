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
            remove: 'Remove Item',
            continue: 'Continue Shopping',
            clear: 'Clear Cart'
        }
    }),
    computed: {
        ...mapState([
            'baseUrl',
            'quoteItemData'
        ]),
        ...mapGetters([
            'priceFormat',
            'filterUrl'
        ])
    }
})
export class VShipping extends Vue {
    shopping () {
        window.location.href = this.baseUrl
    }

    clearCart () {
        
    }

    moveWishlist (item: any) {
        console.log(item)
    }

    removeItem (item: any) {
        console.log(item)
    }
}