import Vue from 'vue'
import Component from 'vue-class-component'

declare let window: any

@Component({
    name: 'v-currency',
    data: () => ({
        currency: [],
        selectCurrency: ''
    })
})
export class VCurrency extends Vue {
    public currency: any[] = []
    public selectCurrency: string = ''

    mounted () {
        this.init()
    }

    init () {
        let commonJson: any = window.commonJson
        this.currency = commonJson.currency
        this.selectCurrency = commonJson.current_code
    } 
}