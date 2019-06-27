import Vue from 'vue'
import Component from 'vue-class-component'
import { VProductZoomer } from '../../ui/module/zoomer'

@Component({
    name: 'v-product-media',
    components: {
        VProductZoomer
    }
})
export class VProductMedia extends Vue {
    public images: any
    public options: any

    constructor () {
        super()
        this.images = {
            normal_size: [
                {
                    id: 1,
                    url: 'http://yoohooworld.com/assets/images/vue_product_zoomer/normal_size/4.jpeg'
                },
                {
                    id: 2,
                    url: 'http://yoohooworld.com/assets/images/vue_product_zoomer/normal_size/5.jpeg'
                }
            ]
        }
        this.options = {
            'zoomFactor': 3,
            'pane': 'pane',
            'hoverDelay': 300,
            'namespace': 'zoomer',
            'move_by_click': false,
            'scroll_items': 7,
            'choosed_thumb_border_color': '#dd2c00'
        }
    }
}