import args from '../util/args'

const modulesConfig: string[] = [
    'cms_index',
    'cms_page',
    'catalog_category',
    'catalog_product',
    'catalog_compare',
    'checkout_cart',
    'checkout_index',
    'customer_login',
    'customer_create',
    'customer_account',
    'customer_password',
    'customer_logout',
    'sales_order',
    'downloadable_product',
    'wishlist_index',
    'customer_address',
    'customer_edit',
    'vault_cards',
    'paypal_billing',
    'review_customer',
    'review_details',
    'newsletter_index',
    'search_term',
    'sales_guest',
    'contact_index',
    'catalog_search'
]
let compileModules: string[] = []
const compileM: string = args.module

if (compileM) {
    if (modulesConfig.includes(compileM)) {
        compileModules.push(compileM)
    }
} else {
    compileModules = modulesConfig
}

export default compileModules