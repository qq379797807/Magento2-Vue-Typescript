import Vue from 'vue'
import Component from 'vue-class-component'

declare let window: any

@Component({
    name: 'v-language',
    data: () => ({
        language: [],
        selectLanguage: ''
    })
})
export class VLanguage extends Vue {
    public language: any[] = []
    public selectLanguage: any = ''

    mounted () {
        this.init()
    }

    init () {
        let commonJson: any = window.commonJson
        this.language = commonJson.stores
    } 
}