import Vue, { CreateElement } from 'vue'
import Component from 'vue-class-component'

@Component({
    name: 'v-totals',
    data: () => ({
        title: 'content'
    })
})
export class VTotals extends Vue {
    mounted () {
        
    }

    render (h: CreateElement): JSX.Element {
        return (
            <div class="in-totals">
                
            </div>
        )
    }
}