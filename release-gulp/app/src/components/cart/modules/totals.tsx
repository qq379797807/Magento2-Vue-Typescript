import Vue, { CreateElement } from 'vue'
import { mapGetters } from 'vuex'
import Component from 'vue-class-component'

@Component({
    name: 'v-totals',
    data: () => ({
        title: 'content'
    }),
    computed: {
        ...mapGetters([
            'priceFormat',
            'totalsData'
        ])
    }
})
export class VTotals extends Vue {
    mounted () {
        
    }

    render (h: CreateElement): JSX.Element {
        return (
            <div class="in-totals">
                {this.totalsData.total_segments.map((item: any, key: number) => {
                    return (
                        <div class="item">
                            <p>{item.title}</p>
                            <p>{this.priceFormat(item.value)}</p>
                        </div>
                    )
                })}
            </div>
        )
    }
}