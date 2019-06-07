import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    name: 'v-newsletter',
    data: () => ({
        title: 'newsletter'
    })
})
export class VNewsletter extends Vue {
    mounted () {
        this.init()
    }
    
    init () {

    }
}