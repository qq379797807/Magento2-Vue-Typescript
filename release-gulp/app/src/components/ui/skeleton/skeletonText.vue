<template>
    <div :class="className">
        <div v-for="n in lines" :key="n" :class="`${className}__line`"></div>
    </div>
</template>

<script>
export default {
    name: 'v-skeleton-text',
    data: () => ({
        className: 'v-skeleton-text'
    }),
    props: {
        lines: {
            type: Number,
            default: 4
        }
    }
}
</script>