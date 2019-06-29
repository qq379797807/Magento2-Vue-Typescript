<template>
    <div class="in-shipping">
        <h2>
            <span class="mark"></span>
            <span v-text="i18n.shippingTitle"></span>
        </h2>
    </div>
</template>

<script>
export default {
    name: 'v-shipping-view',
    data: () => ({
        i18n: {
            shippingTitle: 'Shipping Address'
        }
    })    
}
</script>