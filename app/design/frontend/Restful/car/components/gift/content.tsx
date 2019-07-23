import Vue from 'vue'
import Component from 'vue-class-component'
import { VTitle } from '../title/title'
import { VMessage } from '../message/message'
import { VGiftCard } from './modules/card'

@Component({
    name: 'v-content',
    data: () => ({
        title: 'content'
    }),
    components: {
        VTitle,
        VMessage,
        VGiftCard
    }
})
export class VContent extends Vue {}