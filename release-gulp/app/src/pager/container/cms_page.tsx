import Vue from 'vue'
import Component from 'vue-class-component'
import { VHeader } from '@components/header/header'
import { VNavagition } from '@components/navagition/navagition'
import { VBreadcrumbs } from '@components/breadcrumbs/breadcrumbs'
import { VContent } from '@components/page/content'
import { VFooter } from '@components/footer/footer'

@Component({
    name: 'v-app',
    data: () => ({
        theme: 'Magento2 Vue Theme'
    }),
    components: {
        VHeader,
        VNavagition,
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