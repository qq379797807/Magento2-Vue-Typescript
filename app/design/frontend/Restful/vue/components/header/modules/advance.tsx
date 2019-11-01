import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    name: 'v-advance-search',
    data: () => ({
        title: 'advance search'
    })
})
export class VAdvanceSearch extends Vue {
    mounted () {
        this.init()
    }

    init () {

    } 
}