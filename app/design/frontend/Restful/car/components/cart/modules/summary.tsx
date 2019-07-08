import Vue from 'vue'
import Component from 'vue-class-component'
import { VEstimate } from './estimate'
import { VTotals } from './totals'

@Component({
    name: 'v-summary',
    data: () => ({
        title: 'content'
    }),
    components: {
        VEstimate,
        VTotals
    }
})
export class VSummary extends Vue {
    mounted () {
        
    }
}