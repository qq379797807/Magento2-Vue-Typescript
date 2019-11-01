import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    name: 'v-header-lnks',
    data: () => ({
        title: 'header-links'
    })
})
export class VHeaderLinks extends Vue {
    mounted () {
        this.init()
    }

    init () {
        
    } 
}