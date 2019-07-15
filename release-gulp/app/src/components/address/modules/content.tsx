import Vue from 'vue'
import Component from 'vue-class-component'
import { VTitle } from '../../title/title'
import { VMessage } from '../../message/message'
import { VAddressForm } from './form'

@Component({
    name: 'v-content',
    data: () => ({
        title: 'content',
    }),
    components: {
        VTitle,
        VMessage,
        VAddressForm
    }
})
export class VContent extends Vue {}