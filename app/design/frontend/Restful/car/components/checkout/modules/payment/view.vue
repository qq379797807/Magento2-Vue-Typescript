<template>
    <div class="in-payment">
        <h2>
            <span class="mark"></span>
            <span v-text="i18n.paymentTitle"></span>
        </h2>
    </div>
</template>

<script>
export default {
    name: 'v-payment-view',
    data: () => ({
        i18n: {
            paymentTitle: 'Payment Method'
        }
    })    
}
</script>