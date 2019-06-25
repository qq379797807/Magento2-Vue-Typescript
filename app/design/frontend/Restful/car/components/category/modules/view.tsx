import Vue from 'vue'
import Component from 'vue-class-component'
import { VCategoryImage } from './image'
import { VCategoryDescription } from './description'
import { VCategoryCms } from './cms'

@Component({
    name: 'v-category-view',
    data: () => ({
        title: 'view'
    }),
    components: {
        VCategoryImage,
        VCategoryDescription,
        VCategoryCms
    }
})
export class VCategoryView extends Vue {
    
}