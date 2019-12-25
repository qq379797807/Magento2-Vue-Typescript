import Vue from 'vue'
import Component from 'vue-class-component'
import { mapState, mapGetters, mapMutations } from 'vuex'
import { VProductItem } from '../../common/product'
import { VLoading } from '../../loader/loader'
import { getProducts } from '../../queries/getProducts.gql'

@Component({
    name: 'v-product-list',
    components: {
        VProductItem,
        VLoading
    },
    computed: {
        ...mapState([
            'infiniteId'
        ]),
        ...mapGetters([
            'filter',
            'loading',
            'getSorter',
            'productList',
            'currentPage',
            'totalPages'
        ])
    },
    methods: {
        ...mapMutations([
            'setPageInfo',
            'updateProducts'
        ])
    }
})
export class VProductList extends Vue {
    public pageSize: number = 24
    public categoryId: string = ''

    mounted () {
        this.init()
    }

    init () {
        let categoryJson: any = window.categoryJson
        this.categoryId = categoryJson.category_id
    }

    infiniteScroll ($state: any) {
        if (this.currentPage <= this.totalPages) {
            let filterParam: any = this.filter

            if (!filterParam.category_id) {
                filterParam = Object.assign(filterParam, {
                    category_id: {
                        eq: this.categoryId
                    }
                })
            }

            this.$apollo.query({
                query: getProducts,
                variables: {
                    filter: filterParam,
                    sort: this.getSorter,
                    pageSize: this.pageSize,
                    currentPage: this.currentPage,
                    onServer: false
                }
            }).then((response: any) => {
                if (response) {
                    const products: any = response.data.products

                    this.updateProducts({
                        item: 'productList',
                        value: products.items,
                        filters: products.filters,
                        pageInfo: products.page_info 
                    })

                    if (products.items.length < this.pageSize) {
                        $state.complete()
                    } else {
                        $state.loaded()
                    }
                } 
            }).catch((error: any) => {
                console.warn(error)
                $state.reset()
            })
        } else {
            $state.complete()
        }
    }
}