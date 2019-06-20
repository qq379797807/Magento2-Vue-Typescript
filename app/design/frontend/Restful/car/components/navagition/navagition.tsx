import Vue from 'vue'
import Component from 'vue-class-component'

declare let window: any;

@Component({
    name: 'v-navagition',
    data: () => ({
        categories: [],
        counter: 0
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