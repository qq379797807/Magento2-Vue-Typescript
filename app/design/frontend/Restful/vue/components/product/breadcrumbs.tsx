import Vue from 'vue'
import Component from 'vue-class-component'

declare let window: any;

@Component({
    name: 'v-breadcrumbs',
    data: () => ({
        breadcrumbs: {}
    })
})
export class VBreadcrumbs extends Vue {
    public breadcrumbs: object = {}

    mounted () {
        this.init()
    }

    init () {
        let productJson: any = window.productJson
        this.breadcrumbs = productJson.breadcrumbs
    } 
}