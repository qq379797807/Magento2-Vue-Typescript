<template>
    <div class="in-summary">
        <h2>
            <span class="mark"></span>
            <span v-text="i18n.summaryitle"></span>
        </h2>
        <ul class="in-collection" v-if="quoteItemData.length > 0">
            <li v-for="item in quoteItemData">
                <a :href="filterUrl(item)" :title="item.name">
                    <img v-lazy="item.thumbnail" />
                    <span v-text="item.name"></span>
                </a>
                <p class="in-price" v-text="priceFormat(item.base_price)"></p>
            </li>
        </ul>
        <div class="list" v-if="totalsData.total_segments.length > 0">
            <div class="item" v-for="item in totalsData.total_segments">
                <p v-text="item.title"></p>
                <p v-text="priceFormat(item.value)"></p>
            </div>
        </div>
        <div class="in-button">
            <v-button type="primary" native="button" v-text="i18n.placeOrder" @click="checkout"></v-button>
            <v-button type="primary" native="button" v-text="i18n.goShopping" @click="shopping"></v-button>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
    name: 'v-summary-view',
    data: () => ({
        i18n: {
            summaryitle: 'Order Review',
            placeOrder: 'Place Order',
            goShopping: 'Go Shopping'
        }
    }),
    computed: {
        ...mapState([
            'quoteItemData'
        ]),
        ...mapGetters([
            'priceFormat',
            'filterUrl',
            'totalsData'
        ])
    },
    mounted () {
        this.init()
    },
    methods: {
        init () {
            
        },
        shopping () {
            window.location.href = this.$store.state.baseUrl
        },
        checkout () {
            console.log(`Go checkout ...`)
        } 
    }
}
</script>