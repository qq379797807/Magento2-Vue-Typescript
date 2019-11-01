import Vue from 'vue'
import Component from 'vue-class-component'

declare let window: any;

@Component({
    name: 'v-breadcrumbs',
    data: () => ({
        breadcrumbs: []
    })
})
export class VBreadcrumbs extends Vue {
    public breadcrumbs: string[] = []

    mounted () {
        this.init()
    }

    init () {
        let commonJson: any = window.commonJson
    } 
}