import Vue from 'vue'
import Component from 'vue-class-component'
import { VCategoryImage } from './image'
import { VCategoryDescription } from './description'
import { VCategoryCms } from './cms'
import { getProducts } from '../../queries/getProducts.gql'

declare let window: any

@Component({
    name: 'v-category-view',
    data: () => ({
        title: 'view',
        category: null
    }),
    components: {
        VCategoryImage,
        VCategoryDescription,
        VCategoryCms
    }
})
export class VCategoryView extends Vue {
    public pageSize: number = 20
    public currentPage: number = 1
    public categoryId: string = ''

    mounted () {
        this.init()
    }

    init () {
        let categoryJson: any = window.categoryJson
        this.categoryId = categoryJson.category_id
        this.getProducts(this.pageSize, this.currentPage)
    }

    getProducts (size: number, current: number) {
        this.$apollo.addSmartQuery('category', {
            query: getProducts,
            variables: () => ({
                id: this.categoryId,
                pageSize: size,
                currentPage: current,
                onServer: false
            })
        })
    }
}