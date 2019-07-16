import Vue, { CreateElement } from 'vue'
import Component from 'vue-class-component'

@Component({
    name: 'v-product-media',
    data: () => ({
        i18n: {

        }
    })
})
export class VProductMedia extends Vue {
    mounted () {
        this.init()
    }

    init () {
        
    }

    render (h: CreateElement): JSX.Element {
        return (
            <div class="in-gallery">
                
            </div>
        )
    }
}