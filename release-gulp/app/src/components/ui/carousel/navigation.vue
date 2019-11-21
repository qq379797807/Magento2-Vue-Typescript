<template>
    <div class="vue-carousel-navigation">
        <button
            type="button"
            aria-label="Previous page"
            :tabindex="canAdvanceBackward ? 0 : -1"
            class="vue-carousel-navigation-button vue-carousel-navigation-prev"
            @click.prevent="triggerPageAdvance('backward')"
            :class="{ 'vue-carousel-navigation--disabled': !canAdvanceBackward }"
            :style="`padding: ${clickTargetSize}px; margin-right: -${clickTargetSize}px;`"
            v-html="prevLabel"></button>
        <button
            type="button"
            aria-label="Next page"
            :tabindex="canAdvanceForward ? 0 : -1"
            class="vue-carousel-navigation-button vue-carousel-navigation-next"
            @click.prevent="triggerPageAdvance('forward')"
            :class="{ 'vue-carousel-navigation--disabled': !canAdvanceForward }"
            :style="`padding: ${clickTargetSize}px; margin-left: -${clickTargetSize}px;`"
            v-html="nextLabel"></button>
    </div>
</template>

<script>
export default {
    name: 'navigation',
    inject: [
        'carousel'
    ],
    props: {
        clickTargetSize: {
            type: Number,
            default: 8
        },
        nextLabel: {
            type: String,
            default: '&#9654'
        },
        prevLabel: {
            type: String,
            default: '&#9664'
        }
    },
    computed: {
        canAdvanceForward () {
            return this.carousel.canAdvanceForward || false
        },
        canAdvanceBackward () {
            return this.carousel.canAdvanceBackward || false
        }
    },
    methods: {
        triggerPageAdvance (direction) {
            this.$emit('navigationclick', direction)
        }
    }
}
</script>