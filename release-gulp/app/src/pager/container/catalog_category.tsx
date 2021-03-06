import Vue from 'vue'
import Component from 'vue-class-component'
import { VHeader } from '@components/header/header'
import { VBreadcrumbs } from '@components/category/breadcrumbs'
import { VContent } from '@components/category/content'
import { VCategoryModal } from '@components/common/modal'
import { VFooter } from '@components/footer/footer'

@Component({
    name: 'v-app',
    data: () => ({
        theme: 'Magento2 Vue Theme'
    }),
    components: {
        VHeader,
        VBreadcrumbs,
        VContent,
        VCategoryModal,
        VFooter
    }
})
export class VApp extends Vue {
    mounted () {
        this.init()
    }

    init () {
        console.log(`Magento2 App is bootstrap ...`)
    }   
}