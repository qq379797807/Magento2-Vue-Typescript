<template>
    <div class="in-method">
        <h2>
            <span class="mark"></span>
            <span v-text="i18n.methodTitle"></span>
        </h2>
    </div>
</template>

<script>
export default {
    name: 'v-method-view',
    data: () => ({
        i18n: {
            methodTitle: 'Shipping Method'
        }
    })    
}
</script>