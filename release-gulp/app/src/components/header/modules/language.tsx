import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    name: 'v-language',
    data: () => ({
        title: 'language'
    })
})
export class VLanguage extends Vue {
    mounted () {
        this.init()
    }

    init () {
        
    } 
}