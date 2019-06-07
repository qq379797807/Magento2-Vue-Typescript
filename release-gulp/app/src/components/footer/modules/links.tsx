import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    name: 'v-footer-links',
    data: () => ({
        title: 'links'
    })
})
export class VFooterLinks extends Vue {
    mounted () {
        this.init()
    }
    
    init () {

    }
}