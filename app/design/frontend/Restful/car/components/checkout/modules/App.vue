<template>
    <div class="in-checkout">
        <h2 v-text="title"></h2>
        <v-input :label="label" v-model="address"></v-input>
    </div>
</template>

<script>
export default {
    name: 'v-checkout',
    data: () => ({
        title: 'One Step Checkout',
        label: 'First Name',
        address: null
    }),
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