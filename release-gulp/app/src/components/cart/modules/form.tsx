import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    name: 'v-shipping',
    data: () => ({
        title: 'content'
    })
})
export class VShipping extends Vue {
    mounted () {
        this.init()
    }

    init () {

    }
}