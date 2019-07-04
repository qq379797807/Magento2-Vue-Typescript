import Vue, { CreateElement } from 'vue'
import Component from 'vue-class-component'

@Component({
    name: 'v-estimate',
    data: () => ({
        title: 'estimate'
    })
})
export class VEstimate extends Vue {
    mounted () {
        this.init()
    }

    init () {

    }

    render (h: CreateElement): JSX.Element {
        return (
            <div class="in-estimate">
                
            </div>
        )
    }
}