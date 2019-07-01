<template>
    <div class="in-summary">
        <h2>
            <span class="mark"></span>
            <span v-text="i18n.summaryitle"></span>
        </h2>
        <div class="list">
            <div class="item">
                <p v-text="i18n.shipping"></p>
                <p>$72.00</p>
            </div>
            <div class="item">
                <p v-text="i18n.tax"></p>
                <p>$72.00</p>
            </div>
        </div>
        <div class="total">
            <p v-text="i18n.total"></p>
            <p>$72.00</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'v-summary-view',
    data: () => ({
        i18n: {
            summaryitle: 'Order Review',
            shipping: 'Shipping',
            tax: 'Tax',
            total: 'Order Total'
        }
    })    
}
</script>