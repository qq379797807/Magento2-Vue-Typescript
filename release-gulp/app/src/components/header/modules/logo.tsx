import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    name: 'v-logo',
    data: () => ({
        logo: {}
    })
})
export class VLogo extends Vue {
    public logo: any

    mounted () {
        this.init()
    }

    init () {
        let commonJson: any = window.commonJson
        this.logo = commonJson.logo
    } 
}