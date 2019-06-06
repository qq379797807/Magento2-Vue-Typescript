import Vue from 'vue'
import Component from 'vue-class-component'
import { VLogo } from './logo/logo'

@Component({
    name: 'v-header',
    data: () => ({
        title: 'header'
    }),
    components: {
        VLogo
    }
})
export class VHeader extends Vue {
    mounted () {
        this.init()
    }

    init () {
        console.log(`Header is init ...`)
    } 
}