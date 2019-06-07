import Vue from 'vue'
import Component from 'vue-class-component'
import { VFooterLinks } from './modules/links'
import { VNewsletter } from './modules/newsletter'
import { VCopyright } from './modules/copyright'

@Component({
    name: 'v-footer',
    data: () => ({
        title: 'footer'
    }),
    components: {
        VFooterLinks,
        VNewsletter,
        VCopyright
    }
})
export class VFooter extends Vue {
    mounted () {
        this.init()
    }
    
    init () {

    }
}