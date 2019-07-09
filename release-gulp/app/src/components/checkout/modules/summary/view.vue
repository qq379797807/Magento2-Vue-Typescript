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
        <div class="in-discount">
            <v-collapse>
                <v-collapse-panel name="discount">
                    <h4 v-text="i18n.coupon"></h4>
                    <template slot="content">
                        <v-form-item>
                            <v-input name="coupon_code" v-model="coupon" :placeholder="i18n.coupon"></v-input>
                        </v-form-item>
                        <v-form-item>
                            <v-button type="primary" native="button" v-text="i18n.applay"></v-button>
                        </v-form-item>
                    </template>
                </v-collapse-panel>
            </v-collapse>
        </div>
        <div class="in-gift">
            <v-collapse>
                <v-collapse-panel name="gift">
                    <h4 v-text="i18n.gift"></h4>
                    <template slot="content">
                        <v-form-item>
                            <v-input name="giftcard_code" v-model="gift" :placeholder="i18n.gift"></v-input>
                        </v-form-item>
                        <v-form-item>
                            <v-button type="primary" native="button" v-text="i18n.applay"></v-button>
                        </v-form-item>
                    </template>
                </v-collapse-panel>
            </v-collapse>
        </div>
        <div class="in-comments">
            <v-collapse>
                <v-collapse-panel name="comments">
                    <h4 v-text="i18n.comments"></h4>
                    <template slot="content">
                        <v-form-item>
                            <v-textarea :autoHeight="autoHeight" v-model="comments" :placeholder="i18n.comments"></v-textarea>
                        </v-form-item>
                    </template>
                </v-collapse-panel>
            </v-collapse>
        </div>
        <v-checkbox name="agreement" v-model="agreement" value="1">
            <a href="javacript:;" class="in-agree" v-text="i18n.agreement"></a>
        </v-checkbox>
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
            goShopping: 'Go Shopping',
            coupon: 'Enter discount code',
            gift: 'Enter gift card code',
            comments: 'Enter comments',
            agreement: 'I accept these terms and conditions',
            applay: 'Applay'
        },
        coupon: '',
        gift: '',
        comments: '',
        agreement: false,
        autoHeight: true
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