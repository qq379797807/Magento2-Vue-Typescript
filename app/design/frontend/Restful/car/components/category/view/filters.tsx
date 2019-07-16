import Vue from 'vue'
import Component from 'vue-class-component'

declare let window: any

@Component({
    name: 'v-filters',
    data: () => ({
        i18n: {
            sortby: 'Sort By',
            chooseSorter: 'Choose Sorter'
        }
    })
})
export class VFilters extends Vue {
    public sorter: any[] = []
    public selectSorter: string = ''

    mounted () {
        this.init()
    }

    init () {
        let categoryJson: any = window.categoryJson
        this.sorter = categoryJson.sorter
    }

    changeSorter () {
        console.log(this.selectSorter)
    }
}