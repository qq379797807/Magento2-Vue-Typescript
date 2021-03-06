import Vue from 'vue'
import Component from 'vue-class-component'
import { VBreadcrumbs } from '@components/breadcrumbs/breadcrumbs'
import { VContent } from '@components/sales/print/content'

@Component({
    name: 'v-app',
    data: () => ({
        theme: 'Magento2 Vue Theme'
    }),
    components: {
        VBreadcrumbs,
        VContent
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