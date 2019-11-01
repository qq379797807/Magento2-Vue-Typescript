import Vue from 'vue'
import Component from 'vue-class-component'

declare let window: any

@Component({
    name: 'v-title',
    data: () => ({
        title: ''
    })
})
export class VTitle extends Vue {
    public title: string = ''

    mounted () {
        this.init()
    }

    init () {
        let commonJson: any = window.commonJson
        this.title = commonJson.title
    } 
}