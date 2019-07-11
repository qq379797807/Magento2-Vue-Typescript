import Vue from 'vue'
import Component from 'vue-class-component'
import { VProductForm } from './form'

@Component({
    name: 'v-product-main',
    data: () => ({
        title: 'main'
    }),
    components: {
        VProductForm
    }
})
export class VProductMain extends Vue {
    
}