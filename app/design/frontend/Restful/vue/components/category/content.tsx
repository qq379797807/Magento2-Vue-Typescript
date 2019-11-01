import Vue from 'vue'
import Component from 'vue-class-component'
import { VTitle } from '../title/title'
import { VMessage } from '../message/message'
import { VCategoryView } from './modules/view'
import { VCategoryContent } from './view/view'

@Component({
    name: 'v-content',
    data: () => ({
        title: 'content'
    }),
    components: {
        VTitle,
        VMessage,
        VCategoryView,
        VCategoryContent
    }
})
export class VContent extends Vue {}