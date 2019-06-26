import Vue from 'vue'
import Component from 'vue-class-component'
import { VTitle } from '../title/title'
import { VMessage } from '../message/message'
import { VProductView } from './modules/view'
import { VProductDetails } from './modules/details'

@Component({
    name: 'v-content',
    data: () => ({
        title: 'content'
    }),
    components: {
        VTitle,
        VMessage,
        VProductView,
        VProductDetails
    }
})
export class VContent extends Vue {

}