import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    name: 'v-copyright',
    data: () => ({
        title: 'copyright'
    })
})
export class VCopyright extends Vue {
    mounted () {
        this.init()
    }
    
    init () {

    }
}