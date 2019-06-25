import Vue from 'vue'
import Component from 'vue-class-component'

declare let window: any

@Component({
    name: 'v-category-description',
    data: () => ({
        description: ''
    })
})
export class VCategoryDescription extends Vue {
    public description: string = ''

    mounted () {
        this.init()
    }

    init () {
        let categoryJson: any = window.categoryJson
        this.description = categoryJson.category_description
    }
}