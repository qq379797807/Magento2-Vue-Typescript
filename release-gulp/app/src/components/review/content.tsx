import Vue from 'vue'
import Component from 'vue-class-component'
import { VTitle } from '../title/title'
import { VMessage } from '../message/message'
import { VReviews } from './modules/reviews'

@Component({
    name: 'v-content',
    data: () => ({
        title: 'content'
    }),
    components: {
        VTitle,
        VMessage,
        VReviews
    }
})
export class VContent extends Vue {}