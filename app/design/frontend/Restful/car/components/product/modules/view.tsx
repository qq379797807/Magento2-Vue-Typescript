import Vue from 'vue'
import { mapMutations } from 'vuex'
import Component from 'vue-class-component'
import { VProductMain } from './main'
import { VProductMedia } from './media'
import { createCart } from '../../queries/createCart.gql'

@Component({
    name: 'v-product-view',
    data: () => ({
        title: 'view'
    }),
    components: {
        VProductMain,
        VProductMedia
    },
    methods: {
        ...mapMutations([
            'setCartId'
        ])
    }
})
export class VProductView extends Vue {
    public cartId: string = ''
    
    mounted () {
        this.init()
    }

    async init () {
        const result: any = await this.$apollo.mutate({
            mutation: createCart,
            variables: {
                cart_id: null
            }
        })

        if (result.data) {
            this.setCartId(result.data.createEmptyCart)
        }
    }
}