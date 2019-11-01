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
                {/* <div class="in-methods">
                    {this.shippingMethods.length > 0 ? (
                        <ul class="list">
                            {this.shippingMethods.map((item: any, key: number) => {
                                return (
                                    <li>
                                        <v-radio name="shipping[method]" vModel="selectShipping" checked={item.options[0].carrier_code}>{item.carrier_title}</v-radio>
                                    </li>
                                )
                            })}
                        </ul>
                    ) : (
                        <p class="no" v-else v-text="i18n.noMethod"></p>
                    )}
                </div> */}
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