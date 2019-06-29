<template>
    <div class="in-summary">
        <h2>
            <span class="mark"></span>
            <span v-text="i18n.summaryitle"></span>
        </h2>
    </div>
</template>

<script>
export default {
    name: 'v-summary-view',
    data: () => ({
        i18n: {
            summaryitle: 'Order Review'
        }
    })    
}
</script>