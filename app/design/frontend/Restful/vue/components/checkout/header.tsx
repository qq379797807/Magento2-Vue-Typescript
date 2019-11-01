import Vue from 'vue'
import Component from 'vue-class-component'
import { VLogo } from '../header/modules/logo'

@Component({
    name: 'v-header',
    data: () => ({
        title: 'header'
    }),
    components: {
        VLogo,
    }
})
export class VHeader extends Vue {
    mounted () {
        this.init()
    }

    init () {
        
    } 
}