import Vue from 'vue'
import Component from 'vue-class-component'

declare let window: any

@Component({
    name: 'v-copyright',
    data: () => ({
        copyright: ''
    })
})
export class VCopyright extends Vue {
    public copyright: string = ''

    mounted () {
        this.init()
    }
    
    init () {
        let commonJson: any = window.commonJson
        this.copyright = commonJson.copyright
    }
}