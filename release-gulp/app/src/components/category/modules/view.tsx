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
    mounted () {
        this.init()
    }

    init () {
        let commonJson: any = window.commonJson
        
        this.$apollo.addSmartQuery('category', {
            query: getProducts,
            variables: () => ({
                id: 11
            })
        })
    }
}