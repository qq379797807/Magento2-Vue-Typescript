import Vue from 'vue'
import Component from 'vue-class-component'
import { VTitle } from '../title/title'
import { VMessage } from '../message/message'
import { VCheckoutView } from './modules/checkout'

@Component({
    name: 'v-content',
    data: () => ({
        title: 'checkout'
    }),
    components: {
        VTitle,
        VMessage,
        VCheckoutView
    }
})
export class VContent extends Vue {
    mounted () {
        this.init()
    }

    init () {

    }
}