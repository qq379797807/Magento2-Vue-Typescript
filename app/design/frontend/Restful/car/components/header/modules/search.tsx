import Vue from 'vue'
import Component from 'vue-class-component'
import { VAdvanceSearch } from './advance'

@Component({
    name: 'v-search',
    data: () => ({
        title: 'search'
    }),
    components: {
        VAdvanceSearch
    }
})
export class VSearch extends Vue {
    mounted () {
        this.init()
    }

    init () {

    } 
}