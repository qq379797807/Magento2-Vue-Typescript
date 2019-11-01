import Vue from 'vue'
import Component from 'vue-class-component'
import { VProductPrice } from './price'
import { VProductForm } from './form'

@Component({
    name: 'v-product-main',
    data: () => ({
        title: 'main'
    }),
    components: {
        VProductPrice,
        VProductForm
    }
})
export class VProductMain extends Vue {}