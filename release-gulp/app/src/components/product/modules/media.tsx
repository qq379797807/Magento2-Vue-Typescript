import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    name: 'v-product-media',
    components: {

    }
})
export class VProductMedia extends Vue {
    public images: any
    public options: any

    constructor () {
        super()
    }
}