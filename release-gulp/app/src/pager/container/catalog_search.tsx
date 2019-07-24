import Vue from 'vue'
import Component from 'vue-class-component'
import { VHeader } from '@components/header/header'
import { VBreadcrumbs } from '@components/breadcrumbs/breadcrumbs'
import { VContent } from '@components/search/content'
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