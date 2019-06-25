import Vue from 'vue'
import Component from 'vue-class-component'
import { VCategoryDescription } from './description'

@Component({
    name: 'v-category-view',
    data: () => ({
        title: 'view'
    }),
    components: {
        VCategoryDescription
    }
})
export class VCategoryView extends Vue {
    
}