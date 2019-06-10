import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    name: 'v-message',
    data: () => ({
        title: 'message'
    })
})
export class VMessage extends Vue {
    mounted () {
        this.init()
    }

    init () {

    } 
}