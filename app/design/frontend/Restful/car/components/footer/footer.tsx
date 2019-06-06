import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    name: 'v-footer',
    data: () => ({
        title: 'footer'
    })
})
export class VFooter extends Vue {
    mounted () {
        this.init()
    }
    
    init () {

    }
}