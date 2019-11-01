import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    name: 'v-minicart',
    data: () => ({
        title: 'minicart'
    })
})
export class VMinicart extends Vue {
    mounted () {
        this.init()
    }

    init () {

    } 
}