<template>
    <div :class="className">
        <div :class="`${className}__img`" v-if="img"></div>
        <div :class="`${className}__content`">
            <div :class="`${className}__title`"></div>
            <div :class="`${className}__subtitle`"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'v-skeleton-head',
    data: () => ({
        className: 'v-skeleton-head'
    }),
    props: {
        img: {
            type: Boolean,
            default: false
        }
    }
}
</script>