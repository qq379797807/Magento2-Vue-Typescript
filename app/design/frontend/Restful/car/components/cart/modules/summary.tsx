import Vue from 'vue'
import Component from 'vue-class-component'
import { VEstimate } from './estimate'

@Component({
    name: 'v-summary',
    data: () => ({
        title: 'content'
    }),
    components: {
        VEstimate
    }
})
export class VSummary extends Vue {
    mounted () {
        
    }
}