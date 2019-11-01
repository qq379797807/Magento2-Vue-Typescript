import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    name: 'v-product-list',
    data: () => ({
        i18n: {
            addToCart: 'Add To Cart'
        }
    })
})
export class VProductList extends Vue {
    
}