import Vue from 'vue'
import Component from 'vue-class-component'
import { getCmsPage } from '../../queries/getCmsPage.gql'

declare let window: any

@Component({
    name: 'v-pager',
    data: () => ({
        cmsPage: null
    })
})
export class VPager extends Vue {
    public pageId: number = 0

    mounted () {
        this.init()
    }

    init () {
        let pageJson: any = window.pageJson
        this.pageId = Number(pageJson.page_id)

        this.$apollo.addSmartQuery('cmsPage', {
            query: getCmsPage,
            variables: () => ({
                id: this.pageId,
                onServer: false
            })
        })
    }
}