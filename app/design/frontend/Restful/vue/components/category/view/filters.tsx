import Vue from 'vue'
import Component from 'vue-class-component'
import { mapState, mapGetters, mapActions } from 'vuex'

@Component({
    name: 'v-filters',
    data: () => ({
        i18n: {
            chooseSorter: 'Choose Sorter',
            filterBy: 'Filter By',
            clear: 'Clear',
            clearAll: 'Clear All'
        }
    }),
    computed: {
        ...mapState([
            'filters'
        ]),
        ...mapGetters([
            'filter',
            'hasChoose'
        ]),
        uniqueFilter () {
            return JSON.stringify(this.filter) === '{}' ? false : true
        }
    },
    methods: {
        ...mapActions([
            'sorterByProducts',
            'filterByProducts',
            'clearFilter',
            'removeFilter'
        ])
    }
})
export class VFilters extends Vue {
    public selectSorter: string = ''
    public sorter: any[] = []
    public chooseCategory: boolean = false

    mounted () {
        this.init()
    }

    init () {
        const categoryJson: any = window.categoryJson
        this.sorter = categoryJson.sorter
        this.updateSort(this.sorter)
    }

    hasFilter (request_var: string) {
        let flag: boolean = false

        if (request_var === 'price') {
            request_var = 'min_price'

            return this.filter.hasOwnProperty(request_var)
        } else if (request_var === 'cat') {
            request_var = 'category_id'

            return this.filter.hasOwnProperty(request_var) && this.chooseCategory
        } else {
            return this.filter.hasOwnProperty(request_var)
        }
    }

    updateSort (sorter: any[]) {
        sorter.forEach((item: any) => {
            if (item.active) {
                this.selectSorter  = item.value
                return false
            }
        })
    }

    changeSorter () {
        let sorter: any = {}
        let sorterParam: string[] = this.selectSorter.split('_')
        sorter[sorterParam[0]] = (sorterParam[1]).toUpperCase()

        this.$url.setURLParam({
            'product_list_order': sorterParam[0],
            'product_list_dir': sorterParam[1]
        })
        this.$store.commit('showLoading')
        this.sorterByProducts({
            ...sorter
        })
    }

    changeFilter (option: string) {
        const uri: any = {}
        const filter: any = {}
        const params: string[] = option.split('=')
        const query: string = params[0]

        switch (query) {
            case 'price':
                const scope: string[] = (params[1]).split('-')

                if (scope[1] === '') {
                    filter[`min_${query}`] = {
                        gteq: scope[0]
                    }
                } else {
                    filter[`min_${query}`] = {
                        from: scope[0],
                        to: scope[1]
                    }
                }

                break
            case 'special_options':
                filter[query] = {
                    finset: params[1]
                }

                break
            case 'cat':
                filter[`${query}egory_id`] = {
                    eq: params[1]
                }

                this.chooseCategory = true
                break
            default:
                filter[query] = {
                    eq: params[1]
                }
        }

        uri[query] = params[1] 
        this.$store.commit('showLoading')
        this.$url.setURLParam(uri)
        this.filterByProducts(filter)
    }

    clear (params: string) {
        let filter_key: string = ''

        if (params) {
            if (params === 'price') {
                filter_key = 'min_price'
            } else if (params === 'cat') {
                filter_key = 'category_id'
                this.chooseCategory = false
            } else {
                filter_key = params
            }

            this.$store.commit('showLoading')
            this.$url.deleteParam(params)
            this.clearFilter(filter_key)
        }
    }

    clearAll () {
        this.$store.commit('showLoading')
        this.$url.revertURLParam()
        this.removeFilter()
    }
}