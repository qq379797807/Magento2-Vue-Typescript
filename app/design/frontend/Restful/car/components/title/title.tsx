import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    name: 'v-title',
    data: () => ({
        title: 'title'
    })
})
export class VTitle extends Vue {
    mounted () {
        this.init()
    }

    init () {

    } 
}