declare let window: any

const commonJson: any = window.commonJson
const productJson: any = window.productJson

const state: any = {
    config: commonJson,
    data: productJson,
    baseUrl: commonJson.base_url,
    productId: productJson.product_id,
    productAction: productJson.product_action,
    productType: productJson.product_type,
    productPrices: null,
    productGrallery: [],
    configurable: productJson.configurable
}

export default state