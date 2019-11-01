import Vue from 'vue'
import Component from 'vue-class-component'
import { VLogo } from '../../header/modules/logo'
import { VTitle } from '../../title/title'
import { VMessage } from '../../message/message'
import { VCopyright } from '../../footer/modules/copyright'

declare let window: any

@Component({
    name: 'v-content',
    data: () => ({
        title: 'content'
    }),
    components: {
        VLogo,
        VTitle,
        VMessage,
        VCopyright
    }
})
export class VContent extends Vue {
    mounted () {
        this.init()
    }

    init () {
        this.$nextTick(() => {
            window.print()
        })
    }
}