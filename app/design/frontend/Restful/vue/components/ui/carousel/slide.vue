<template>
    <div
        class="vue-carousel-slide"
        tabindex="-1"
        :aria-hidden="!isActive"
        :class="{
            'vue-carousel-slide-active': isActive,
            'vue-carousel-slide-center': isCenter,
            'vue-carousel-slide-adjustableHeight': isAdjustableHeight
        }"
    >
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'slide',
    props: [
        'title'
    ],
    data: () => ({
        width: null
    }),
    inject: [
        'carousel'
    ],
    mounted () {
        if (!this.$isServer) {
            this.$el.addEventListener('dragstart', e => e.preventDefault())
        }

        this.$el.addEventListener(this.carousel.isTouch ? 'touchend' : 'mouseup', this.onTouchEnd)
    },
    computed: {
        activeSlides () {
            const { currentPage, breakpointSlidesPerPage, $children } = this.carousel
            const activeSlides = []
            const children = $children.filter(child =>
                    child.$el && child.$el.className.indexOf('vue-carousel-slide') >= 0
                ).map(child => child._uid)
            let i = 0
            while (i < breakpointSlidesPerPage) {
                const child = children[currentPage * breakpointSlidesPerPage + i]
                activeSlides.push(child)
                i++
            }
            return activeSlides
        },
        isActive () {
            return this.activeSlides.indexOf(this._uid) >= 0
        },
        isCenter () {
            const { breakpointSlidesPerPage } = this.carousel
            if (breakpointSlidesPerPage % 2 === 0 || !this.isActive) return false

            return (this.activeSlides.indexOf(this._uid) === Math.floor(breakpointSlidesPerPage / 2))
        },
        isAdjustableHeight () {
            const { adjustableHeight } = this.carousel
            return adjustableHeight
        }
    },
    methods: {
        onTouchEnd (e) {
            const eventPosX =
                this.carousel.isTouch && e.changedTouches && e.changedTouches.length > 0
                ? e.changedTouches[0].clientX
                : e.clientX
            const deltaX = this.carousel.dragStartX - eventPosX

            if (this.carousel.minSwipeDistance === 0 || Math.abs(deltaX) < this.carousel.minSwipeDistance) {
                this.$emit('slideclick', Object.assign({}, e.currentTarget.dataset))
                this.$emit('slide-click', Object.assign({}, e.currentTarget.dataset))
            }
        }
    }
}
</script>