import Vue from 'vue'
import Component from 'vue-class-component'
import { VFilters } from './filters'
import { VProductList } from './list'

@Component({
    name: 'v-category-content',
    data: () => ({
        title: 'category'
    }),
    components: {
        VFilters,
        VProductList
    }
})
export class VCategoryContent extends Vue {}