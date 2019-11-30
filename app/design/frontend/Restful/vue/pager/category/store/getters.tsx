import { GetterTree } from 'vuex'

const categoryJson: any = window.categoryJson

const getters: GetterTree<any, any> = {
    productList: state => state.productList,
    currentPage: state => state.currentPage,
    totalPages: state => state.totalPages,
    filter: state => state.filter,
    loading: state => state.loading,
    hasChoose: (state) => {
        if (JSON.stringify(state.sorter) === '{}') {
            return false
        } else {
            return true
        }
    },
    getSorter: (state) => {
        if (JSON.stringify(state.sorter) !== '{}') {
            return state.sorter
        } else {
            const sorter: any = {}

            categoryJson.sorter.forEach((item: any) => {
                if (item.active) {
                    const params: string[] = item.value.split('_')
                    sorter[params[0]] = (params[1]).toUpperCase()
                    return sorter
                }
            })
    
            return sorter
        }
    }
}

export default getters