import Vue from 'vue'
import Component from 'vue-class-component'
import { VShipping } from './form'
import { VSummary } from './summary'
import { VCartEmpty } from './empty'

@Component({
    name: 'v-cart',
    data: () => ({
        
    }),
    components: {
        VShipping,
        VSummary,
        VCartEmpty
    }
})
export class VCart extends Vue {

}