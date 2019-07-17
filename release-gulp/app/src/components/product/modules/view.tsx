import Vue from 'vue'
import Component from 'vue-class-component'
import { VProductMain } from './main'
import { VProductMedia } from './media'

@Component({
    name: 'v-product-view',
    data: () => ({
        title: 'view'
    }),
    components: {
        VProductMain,
        VProductMedia
    }
})
export class VProductView extends Vue {}