import Vue from 'vue'
import Component from 'vue-class-component'
import { VCurrency } from '../header/modules/currency'
import { VLanguage } from '../header/modules/language'

@Component({
    name: 'v-navagition',
    data: () => ({
        title: 'navagition'
    }),
    components: {
        VCurrency,
        VLanguage
    }
})
export class VNavagition extends Vue {
    mounted () {
        this.init()
    }

    init () {

    } 
}