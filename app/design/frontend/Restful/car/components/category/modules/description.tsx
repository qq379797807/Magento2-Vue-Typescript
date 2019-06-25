import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    name: 'v-category-description',
    data: () => ({
        title: 'description'
    }),
    components: {
        
    }
})
export class VCategoryDescription extends Vue {
    mounted () {
        this.init()
    }

    init () {

    }
}