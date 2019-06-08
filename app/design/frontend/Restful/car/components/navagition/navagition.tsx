import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    name: 'v-navagition',
    data: () => ({
        title: 'navagition'
    })
})
export class VNavagition extends Vue {
    mounted () {
        this.init()
    }

    init () {

    } 
}