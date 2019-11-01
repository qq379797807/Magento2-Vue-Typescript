import Vue from 'vue'
import Component from 'vue-class-component'
import { VReviews } from './reviews'

@Component({
    name: 'v-product-details',
    data: () => ({
        title: 'details'
    }),
    components: {
        VReviews
    }
})
export class VProductDetails extends Vue {
    
}