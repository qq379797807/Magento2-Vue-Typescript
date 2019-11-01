import Vue from 'vue'
import Component from 'vue-class-component'

declare let window: any

@Component({
    name: 'v-category-image',
    data: () => ({
        url: '',
        name: ''
    })
})
export class VCategoryImage extends Vue {
    public url: string = ''
    public name: string = ''

    mounted () {
        this.init()
    }

    init () {
        let categoryJson: any = window.categoryJson
        this.url = categoryJson.category_image
        this.name = categoryJson.category_name
    }
}