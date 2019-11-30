import { MutationTree } from 'vuex'

const mutations: MutationTree<any> = {
    setProductItem (state, { item, value }) {
        state[item] = value
        state.modalVisible = true
    },
    generateProducts (state, { item, value, filter, sorter, filters, pageInfo }) {
        state[item] = value
        state.loading = false
        state.filter = filter
        state.sorter = sorter
        state.filters = filters
        state.currentPage = pageInfo.current_page + 1
        state.totalPages = pageInfo.total_pages
        state.infiniteId += 1
    },
    updateProducts (state, { item, value, filters, pageInfo }) {
        state[item] = [...state[item], ...value]
        state.filters = filters
        state.currentPage = pageInfo.current_page + 1
        state.totalPages = pageInfo.total_pages
    },
    closeModal (state) {
        state.modalVisible = false
    },
    showLoading (state) {
        state.loading = true
    }
}

export default mutations