import Vue from 'vue'
import Component from 'vue-class-component'
import { VTitle } from '../../title/title'
import { VMessage } from '../../message/message'
import { VAddessEdit } from './form'

@Component({
    name: 'v-content',
    data: () => ({
        title: 'content'
    }),
    components: {
        VTitle,
        VMessage,
        VAddessEdit
    }
})
export class VContent extends Vue {}