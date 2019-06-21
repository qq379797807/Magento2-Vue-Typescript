import Vue from 'vue'
import Component from 'vue-class-component'
import { VShipping } from './form'
import { VSummary } from './summary'

@Component({
    name: 'v-cart',
    data: () => ({
        
    }),
    components: {
        VShipping,
        VSummary
    }
})
export class VCart extends Vue {

}