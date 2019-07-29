import { MutationTree } from 'vuex'

const mutations: MutationTree<any> = {
    setCartId (state, payload) {
        state.cartId = payload
    },
    chooseOption (state, payload) {
        state.productGrallery = payload
    },
    changeQty (state, payload) {
        let tier_price: number = 0
        const qty: number = payload
        const tierPrices: any[] = state.productPrices.tierPrices

        tierPrices.forEach((item: any) => {
            if (qty >= item.qty) {
                tier_price = item.price
            }
        })

        state.tierPrice = tier_price
    }
}

export default mutations