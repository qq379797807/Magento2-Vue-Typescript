import Vue from 'vue'
import Component from 'vue-class-component'

declare let window: any

@Component({
    name: 'v-category-cms',
    data: () => ({
        cms_block: '',
        mixed_mode: false,
        content_mode: false
    })
})
export class VCategoryCms extends Vue {
    public cms_block: string = ''
    public mixed_mode: boolean = false
    public content_mode: boolean = false

    mounted () {
        this.init()
    }

    init () {
        let categoryJson: any = window.categoryJson
        this.cms_block = categoryJson.category_cms
        this.mixed_mode = categoryJson.category_mixedMode
        this.content_mode = categoryJson.category_contentMode
    }
}