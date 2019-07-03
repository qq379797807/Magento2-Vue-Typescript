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
    public selectCurrency: any = ''

    mounted () {
        this.init()
    }

    init () {
        let commonJson: any = window.commonJson
        // this.currency = commonJson.currency
        this.currency = [
            {label: '选项1', value: '1'},
            {label: '选项2', value: '2'},
            {label: '选项3', value: '3'},
            {label: '选项4', value: '4'},
            {label: '选项5', value: '5'}
        ]
    } 
}