import Vue from 'vue'
import Component from 'vue-class-component'
import { VTitle } from '../title/title'
import { VMessage } from '../message/message'
import { VAccountOrders } from './modules/orders'

@Component({
    name: 'v-content',
    data: () => ({
        title: 'content'
    }),
    components: {
        VTitle,
        VMessage,
        VAccountOrders
    }
})
export class VContent extends Vue {}