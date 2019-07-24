import Vue from 'vue'
import Component from 'vue-class-component'

declare let window: any;

@Component({
    name: 'v-navagition',
    data: () => ({
        navResize: {
            point: 'tablet',
            visible: false
        }
    })
})
export class VNavagition extends Vue {
    public categories: string[] = []
    public counter: number = 0

    mounted () {
        this.init()
    }

    init () {
        let commonJson: any = window.commonJson
        this.categories = commonJson.categories
        this.counter = this.categories.length
    } 
}