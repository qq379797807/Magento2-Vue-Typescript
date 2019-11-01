import Vue from 'vue'
import Component from 'vue-class-component'
import { VTitle } from '../title/title'
import { VMessage } from '../message/message'
import { VContactForm } from './modules/form'

@Component({
    name: 'v-content',
    data: () => ({
        title: 'content'
    }),
    components: {
        VTitle,
        VMessage,
        VContactForm
    }
})
export class VContent extends Vue {
    mounted () {
        this.init()
    }

    init () {

    }
}