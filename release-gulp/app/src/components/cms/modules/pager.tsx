import Vue from 'vue'
import Component from 'vue-class-component'
import gql from 'graphql-tag'

declare let window: any

@Component({
    name: 'v-pager',
    data: () => ({
        title: '',
        identities: [],
        pager: '',
        cmsPage: null
    }),
    apollo: {
        cmsPage: gql`query {
            cmsPage(id: 2) {
              url_key
              title
              content
              content_heading
              page_layout
              meta_title
              meta_description
              meta_keywords
            }
        }`
    }
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