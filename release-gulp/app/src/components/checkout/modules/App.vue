<template>
    <div class="in-checkout">
        <h1 v-text="i18n.title"></h1>
        <p v-text="i18n.welcome"></p>
        <div class="in-view">
            <div class="in-item">
                <v-shipping-view></v-shipping-view>
            </div>
            <div class="in-item">
                <v-method-view></v-method-view>
                <v-payment-view></v-payment-view>
            </div>
            <div class="in-item">
                <v-summary-view></v-summary-view>
            </div>
        </div>
    </div>
</template>

<script>
import VShippingView from './shipping/view'
import VMethodView from './method/view'
import VPaymentView from './payment/view'
import VSummaryView from './summary/view'

export default {
    name: 'v-checkout',
    data: () => ({
        i18n: {
            title: 'Checkout',
            welcome: 'Welcome to the checkout. Fill in the fields below to complete your purchase!'
        }
    }),
    components: {
        'v-shipping-view': VShippingView,
        'v-method-view': VMethodView,
        'v-payment-view': VPaymentView,
        'v-summary-view': VSummaryView
    },
    computed: {
        isCustomerLoggedIn () {
            return this.$store.getters.isCustomerLoggedIn
        }
    }
}
</script>