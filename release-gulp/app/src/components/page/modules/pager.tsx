import Vue from 'vue'
import Component from 'vue-class-component'

declare let window: any

@Component({
    name: 'v-pager',
    data: () => ({
        title: '',
        identities: [],
        pager: ''
    })
})
export class VPager extends Vue {
    public title: string = ''
    public identities: string[] = []
    public pager: string = ''

    mounted () {
        this.init()
    }

    init () {
        let pageJson: any = window.pageJson
        this.title = pageJson.title
        this.identities = pageJson.identities
        this.pager = pageJson.pager
    }
}