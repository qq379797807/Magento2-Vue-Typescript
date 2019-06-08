import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    name: 'v-currency',
    data: () => ({
        title: 'currency'
    })
})
export class VCurrency extends Vue {
    mounted () {
        this.init()
    }

    init () {

    } 
}