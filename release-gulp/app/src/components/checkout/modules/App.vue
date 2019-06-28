<template>
    <div class="in-checkout">
        <h2 v-text="title"></h2>
        <v-input :label="label" v-model="address"></v-input>
        <v-checkbox v-model="checkbox">Save in address book</v-checkbox> 
    </div>
</template>

<script>
// import VShippingAddress from '../shipping/address.vue'
export default {
    name: 'v-checkout',
    data: () => ({
        title: 'One Step Checkout',
        label: 'Email',
        address: null,
        checkbox: false
    }),
    components: {
    },
    computed: {
        isCustomerLoggedIn () {
            return this.$store.getters.isCustomerLoggedIn
        }
    },
    mounted () {
        if (this.isCustomerLoggedIn) {
            this.$store.dispatch('getCustomerData')
        }
    }
}
</script>