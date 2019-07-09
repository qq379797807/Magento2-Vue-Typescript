import Vue from 'vue'
import Component from 'vue-class-component'
import { VAdvanceSearch } from './advance'

@Component({
    name: 'v-search',
    data: () => ({
        i18n: {
            search: 'Search entire store here'
        },
        search: ''
    }),
    components: {
        VAdvanceSearch
    }
})
export class VSearch extends Vue {
    public search: string = ''
    
    mounted () {
        this.init()
    }

    init () {

    } 
}