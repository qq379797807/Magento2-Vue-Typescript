import { ApolloActionTree } from './interface'
import { getProducts } from '@components/queries/getProducts.gql'
import { getProduct } from '@components/queries/getProduct.gql'

const actions: ApolloActionTree<any, any> = {
    async showProductModal ({ commit, apollo }, sku: string) {
        let res: any = await apollo.query({
            query: getProduct,
            variables: {
                filter: {
                    sku: {
                        eq: sku
                    }
                },
                onServer: false
            }
        })

        if (res.data.products && res.data.products.items.length === 1) {
            commit('setProductItem', { 
                item: 'productItem', 
                value: res.data.products.items[0] 
            })
        }
    },
    async sorterByProducts ({ commit, state, getters, apollo }, sorter: any) {
        let { category_id } = state
        let { filter } = getters

        if (!filter.category_id) {
            filter = Object.assign(filter, {
                category_id: {
                    eq: category_id
                }
            })
        }

        let res: any = await apollo.query({
            query: getProducts,
            variables: {
                filter: filter,
                sort: sorter,
                pageSize: 24,
                currentPage: 1,
                onServer: false
            }
        })

        if (res.data.products) {
            commit('generateProducts', { 
                item: 'productList', 
                value: res.data.products.items, 
                filter: filter,
                sorter: sorter,
                filters: res.data.products.filters,
                pageInfo: res.data.products.page_info 
            })
        }
    },
    async filterByProducts ({ commit, state, getters, apollo }, filter: any) {
        let { category_id } = state
        let { getSorter } = getters

        if (!filter.category_id) {
            filter = Object.assign(filter, {
                category_id: {
                    eq: category_id
                }
            })
        }
    
        let res: any = await apollo.query({
            query: getProducts,
            variables: {
                filter: filter,
                sort: getSorter,
                pageSize: 24,
                currentPage: 1,
                onServer: false
            }
        })

        if (res.data.products) {
            commit('generateProducts', { 
                item: 'productList', 
                value: res.data.products.items,
                filter: filter,
                sorter: getSorter,
                filters: res.data.products.filters,
                pageInfo: res.data.products.page_info 
            })
        }
    },
    async clearFilter ({ commit, state, getters, apollo }, key: any) {
        let { category_id } = state
        let { filter, getSorter } = getters

        if (filter.hasOwnProperty(key)) {
            delete filter[key]
        }

        if (!filter.category_id) {
            filter = Object.assign(filter, {
                category_id: {
                    eq: category_id
                }
            })
        }

        let res: any = await apollo.query({
            query: getProducts,
            variables: {
                filter: filter,
                sort: getSorter,
                pageSize: 24,
                currentPage: 1,
                onServer: false
            }
        })

        if (res.data.products) {
            commit('generateProducts', { 
                item: 'productList', 
                value: res.data.products.items,
                filter: filter,
                sorter: getSorter,
                filters: res.data.products.filters,
                pageInfo: res.data.products.page_info 
            })
        }
    },
    async removeFilter ({ commit, state, getters, apollo }) {
        let { category_id } = state
        let { getSorter } = getters
        let filter: any = {
            category_id: {
                eq: category_id
            }
        }

        let res: any = await apollo.query({
            query: getProducts,
            variables: {
                filter: filter,
                sort: getSorter,
                pageSize: 24,
                currentPage: 1,
                onServer: false
            }
        })

        if (res.data.products) {
            commit('generateProducts', { 
                item: 'productList', 
                value: res.data.products.items,
                filter: filter,
                sorter: getSorter,
                filters: res.data.products.filters,
                pageInfo: res.data.products.page_info 
            })
        }
    }
}

export default actions