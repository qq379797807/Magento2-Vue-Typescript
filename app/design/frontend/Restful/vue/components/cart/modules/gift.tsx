import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    name: 'v-gift',
    data: () => ({
        i18n: {
            gift: 'Enter gift code',
            applay: 'Apply'
        },
        gift: ''
    })
})
export class VGift extends Vue {
    public gift: string = ''
    
    mounted () {
        
    }
}