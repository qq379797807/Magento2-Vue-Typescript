import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    name: 'v-create',
    data: () => ({
        i18n: {
            comfirm: 'Confirm Password',
            button: 'Create an Account'
        }
    })
})
export class VCreate extends Vue {
    mounted () {
        this.init()
    }

    init () {

    }
}