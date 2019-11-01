import Vue from 'vue'
import Component from 'vue-class-component'
import { VTitle } from '../title/title'
import { VMessage } from '../message/message'
import { VCreate } from './modules/form'

@Component({
    name: 'v-content',
    data: () => ({
        title: 'content'
    }),
    components: {
        VTitle,
        VMessage,
        VCreate
    }
})
export class VContent extends Vue {
    mounted () {
        this.init()
    }

    init () {

    }
}