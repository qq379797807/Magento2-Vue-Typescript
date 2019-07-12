import Vue from 'vue'
import Component from 'vue-class-component'

declare let window: any

@Component({
    name: 'v-advanced-form',
    data: () => ({
        i18n: {
            search: 'Search'
        }
    })
})
export class VAdvancedForm extends Vue {
    public name: string = ''
    public sku: string = ''
    public description: string = ''
    public short_description: string = ''
    public number_from: string = ''
    public number_to: string = ''
    public price_from: string = ''
    public price_to: string = ''
    public currency: string = ''
    public color: any[] = []
    public selectColor: any[] = []

    mounted () {
        this.init()
    }

    init () {
        let commonJson: any = window.commonJson
        let addvancedJson: any = window.addvancedJson
        this.currency = commonJson.current_code
        this.color = addvancedJson.colors
    }
}