import Vue, { CreateElement } from 'vue'
import Component from 'vue-class-component'

@Component({
    name: 'v-product-options',
    data: () => ({
        title: 'options'
    })
})
export class VProductOptions extends Vue {
    render (h: CreateElement): JSX.Element {
        return (
            <div class="v-options">
                
            </div>
        )
    }
}