<template>
    <div
        v-show="carousel.pageCount > 1"
        class="vue-carousel-pagination"
        :class="{ [`vue-carousel-pagination--${paginationPositionModifierName}`]: paginationPositionModifierName }">
        <div class="vue-carousel-dot-container" role="tablist" :style="dotContainerStyle">
            <button
                v-for="(page, index) in paginationCount"
                :key="`${page}_${index}`"
                class="vue-carousel-dot"
                aria-hidden="false"
                role="tab"
                :title="getDotTitle(index)"
                :value="getDotTitle(index)"
                :aria-label="getDotTitle(index)"
                :aria-selected="isCurrentDot(index) ? 'true' : 'false'"
                :class="{ 'vue-carousel-dot--active': isCurrentDot(index) }"
                :style="dotStyle(index)"
                @click="goToPage(index)"></button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'pagination',
    inject: [
        'carousel'
    ],
    computed: {
        paginationPositionModifierName () {
            const { paginationPosition } = this.carousel
            if (paginationPosition.indexOf('overlay') < 0) return
            return paginationPosition
        },
        paginationPropertyBasedOnPosition () {
            return this.carousel.paginationPosition.indexOf('top') >= 0 ? 'bottom' : 'top'
        },
        paginationCount () {
            return this.carousel && this.carousel.scrollPerPage ? this.carousel.pageCount : this.carousel.slideCount || 0
        },
        dotContainerStyle() {
            const { carousel } = this;
            const doublePadding = carousel.paginationPadding * 2
            const containerWidth = carousel.maxPaginationDotCount * (carousel.paginationSize + doublePadding)
            
            return Object.assign({}, {
                overflow: 'hidden',
                width: `${containerWidth}px`,
                margin: '0 auto',
                "white-space": 'nowrap'
            })
        }
    },
    methods: {
        goToPage (index) {
            this.$emit("paginationclick", index)
        },
        isCurrentDot (index) {
            return index === this.carousel.currentPage
        },
        getDotTitle (index) {
            return this.carousel.$children[index].title ? this.carousel.$children[index].title : `Item ${index}`
        },
        dotStyle (index) {
            const { carousel } = this
            const basicBtnStyle = {}
            Object.assign(basicBtnStyle, {
                width: `${carousel.paginationSize}px`,
                height: `${carousel.paginationSize}px`,
                'background-color': `${
                this.isCurrentDot(index)
                    ? carousel.paginationActiveColor
                    : carousel.paginationColor
                }`
            })
            if (carousel.maxPaginationDotCount === -1) return basicBtnStyle

            const eachDotsWidth = carousel.paginationSize + carousel.paginationPadding * 2
            const maxReverse = carousel.pageCount - carousel.maxPaginationDotCount
            const translateAmount =
                carousel.currentPage > maxReverse
                ? maxReverse
                : carousel.currentPage <= carousel.maxPaginationDotCount / 2
                    ? 0 : carousel.currentPage - Math.ceil(carousel.maxPaginationDotCount / 2) + 1
            const transformWidth = 0 - eachDotsWidth * translateAmount

            return Object.assign(basicBtnStyle, {
                '-webkit-transform': `translate3d(${transformWidth}px,0,0)`,
                transform: `translate3d(${transformWidth}px,0,0)`,
                '-webkit-transition': `-webkit-transform ${carousel.speed / 1000}s`,
                transition: `transform ${carousel.speed / 1000}s`
            })
        }
    }
}
</script>