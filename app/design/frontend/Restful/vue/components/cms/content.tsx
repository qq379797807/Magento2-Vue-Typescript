import Vue from 'vue'
import Component from 'vue-class-component'
import { VTitle } from '../title/title'
import { VMessage } from '../message/message'
import { VPager } from './modules/pager'

@Component({
    name: 'v-content',
    data: () => ({
        title: 'content'
    }),
    components: {
        VTitle,
        VMessage,
        VPager
    }
})
export class VContent extends Vue {
    mounted () {
        this.init()
    }

    init () {

    }
}