import { MutationTree } from 'vuex'

const mutations: MutationTree<any> = {
    chooseOption (state, payload) {
        state.productGrallery = payload
    },
    changeQty (state, payload) {
        let tier_price: number = 0
        const qty: number = payload
        const tierPrices: any[] = state.productPrices.tierPrices

        tierPrices.forEach((item: any) => {
            if (item.qty >= qty) {
                tier_price = item.price
            }
        })

        console.log(tier_price)
        state.tierPrice = tier_price
    },
    addToProduct (state, payload) {
        const { item, value } = payload
        state[item] = value
    }
}

export default mutations