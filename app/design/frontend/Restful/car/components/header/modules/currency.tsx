import Vue from 'vue'
import Component from 'vue-class-component'

declare let window: any

@Component({
    name: 'v-currency',
    data: () => ({
        currency: []
    })
})
export class VCurrency extends Vue {
    public currency: any[] = []

    mounted () {
        this.init()
    }

    init () {
        let commonJson: any = window.commonJson
        this.currency = commonJson.currency
    } 
}