<template>
    <div class="in-checkout">
        <h2 v-text="title"></h2>
    </div>
</template>

<script>
export default {
    name: 'v-checkout',
    data: () => ({
        title: 'Checkout Component'
    }),
    computed: {
        isCustomerLoggedIn () {
            console.log(this.$store.getters)
            // return this.$store.getters.isCustomerLoggedIn
            return true
        }
    },
    mounted () {
        if (this.isCustomerLoggedIn) {
            // this.$store.dispatch('getCustomerData')
        }
    }
}
</script>