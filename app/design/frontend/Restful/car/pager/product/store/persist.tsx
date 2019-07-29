import createPersistedState from 'vuex-persistedstate'

declare let window: any

const vuexPersisted: any = createPersistedState({
    key: 'ts-graphql',
    storage: window.localStorage,
    reducer: (state: any) => {
        return {
            cartId: state.cartId,
            cart: {},
            wishlist: {},
            compare: {}
        }
    }
})

export default vuexPersisted