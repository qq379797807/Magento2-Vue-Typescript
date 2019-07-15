import Vue from 'vue'
import Component from 'vue-class-component'
import { VTitle } from '../../title/title'
import { VMessage } from '../../message/message'
import { VCustomerReview } from './customer'

@Component({
    name: 'v-content',
    data: () => ({
        title: 'content'
    }),
    components: {
        VTitle,
        VMessage,
        VCustomerReview
    }
})
export class VContent extends Vue {}