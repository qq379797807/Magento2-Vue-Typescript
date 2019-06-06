import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    name: 'v-logo',
    data: () => ({
        title: 'logo'
    })
})
export class VLogo extends Vue {
    mounted () {
        this.init()
    }

    init () {
        console.log(`Logo is init ...`)
    } 
}