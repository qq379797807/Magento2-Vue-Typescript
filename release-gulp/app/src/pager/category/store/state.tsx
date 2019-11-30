const commonJson: any = window.commonJson
const categoryJson: any = window.categoryJson

const state: any = {
    base_url: commonJson.base_url,
    cart_qty: commonJson.cart_qty,
    country_id: commonJson.country_id,
    current_symbol: commonJson.current_symbol,
    category_id: categoryJson.category_id,
    infiniteId: + new Date(),
    currentPage: 1,
    totalPages: 1,
    productList: [],
    filters: [],
    sorter: {},
    filter: {},
    productItem: {},
    loading: false,
    modalVisible: false
}

export default state