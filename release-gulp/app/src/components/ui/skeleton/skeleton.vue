<template>
    <div :class="className">
        <slot />
    </div>
</template>

<script>
export default {
    name: 'v-skeleton',
    props: {
        rounded: {
            type: Boolean,
            default: false
        },
        centered: {
            type: Boolean,
            default: false
        },
        animated: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        className () {
            return {
                'v-skeleton': true,
                'v-skeleton-is-rounded': this.rounded,
                'v-skeleton-is-centered': this.centered,
                'v-skeleton-is-animated': this.animated
            }
        }
    }
}
</script>
