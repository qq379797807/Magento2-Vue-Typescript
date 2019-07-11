declare let window: any

const commonJson = window.commonJson
const productJson = window.productJson

const state: any = {
    config: commonJson,
    baseUrl: commonJson.base_url,
    productId: productJson.product_id,
    productAction: productJson.product_action,
    product_type: productJson.product_type
}

export default state