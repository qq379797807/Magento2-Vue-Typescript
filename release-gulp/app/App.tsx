import Vue from 'vue'
import Component from 'vue-class-component'
import { VHeader } from './src/components/header/header'
import { VNavagition } from './src/components/navagition/navagition'
import { VContent } from './src/components/content/content'
import { VFooter } from './src/components/footer/footer'

@Component({
    name: 'v-app',
    data: () => ({
        theme: 'Magento2 Vue Theme'
    }),
    components: {
        VHeader,
        VNavagition,
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