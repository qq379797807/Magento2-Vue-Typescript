import Vue from 'vue'
import Component from 'vue-class-component'

declare let window: any

@Component({
    name: 'v-pager',
    data: () => ({
        cmsPage: null
    })
})
export class VPager extends Vue {
    mounted () {
        this.init()
    }

    init () {
        let homeJson: any = window.homeJson
    }
}