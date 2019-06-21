import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    name: 'v-summary',
    data: () => ({
        title: 'content'
    })
})
export class VSummary extends Vue {
    mounted () {
        this.init()
    }

    init () {

    }
}