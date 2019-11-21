<template>
    <div
        class="vue-carousel"
        :class="{ 'vue-carousel--reverse': paginationPosition === 'top' }">
        <div class="vue-carousel-wrapper" ref="vue-carousel-wrapper">
            <div ref="vue-carousel-inner"
                :class="['vue-carousel-inner', { 'vue-carousel-inner--center': isCenterModeEnabled }]"
                :style="{
                    'transform': `translate(${currentOffset}px, 0)`,
                    'transition': dragging ? 'none' : transitionStyle,
                    'ms-flex-preferred-size': `${slideWidth}px`,
                    'webkit-flex-basis': `${slideWidth}px`,
                    'flex-basis': `${slideWidth}px`,
                    'visibility': slideWidth ? 'visible' : 'hidden',
                    'height': `${currentHeight}`,
                    'padding-left': `${padding}px`,
                    'padding-right': `${padding}px`
                }">
                <slot></slot>
            </div>
        </div>

        <slot name="navigation" v-if="navigationEnabled">
            <navigation
                v-if="isNavigationRequired"
                :clickTargetSize="navigationClickTargetSize"
                :nextLabel="navigationNextLabel"
                :prevLabel="navigationPrevLabel"
                @navigationclick="handleNavigation"
            />
        </slot>

        <slot name="pagination" v-if="paginationEnabled">
            <pagination @paginationclick="goToPage($event, 'pagination')" />
        </slot>
    </div>
</template>

<script>
import autoplay from './autoplay'
import Navigation from './navigation'
import Pagination from './pagination'
import Slide from './slide'

const debounce = (func, wait, immediate) => {
    let timeout
    return () => {
        const context = this
        const later = () => {
            timeout = null
            if (!immediate) {
                func.apply(context)
            }
        }

        const callNow = immediate && !timeout
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)

        if (callNow) {
            func.apply(context)
        }
    }
}

const transitionStartNames = {
    onwebkittransitionstart: 'webkitTransitionStart',
    onmoztransitionstart: 'transitionstart',
    onotransitionstart: 'oTransitionStart otransitionstart',
    ontransitionstart: 'transitionstart'
}

const transitionEndNames = {
    onwebkittransitionend: 'webkitTransitionEnd',
    onmoztransitionend: 'transitionend',
    onotransitionend: 'oTransitionEnd otransitionend',
    ontransitionend: 'transitionend'
}

const getTransitionStart = () => {
    for (let name in transitionStartNames) {
        if (name in window) {
        return transitionStartNames[name];
        }
    }
}

const getTransitionEnd = () => {
    for (let name in transitionEndNames) {
        if (name in window) {
            return transitionEndNames[name];
        }
    }
}

export default {
    name: 'carousel',
    beforeUpdate() {
        this.computeCarouselWidth()
    },
    components: {
        Navigation,
        Pagination,
        Slide
    },
    data: () => ({
        browserWidth: null,
        carouselWidth: 0,
        currentPage: 0,
        dragging: false,
        dragMomentum: 0,
        dragOffset: 0,
        dragStartY: 0,
        dragStartX: 0,
        isTouch: typeof window !== 'undefined' && 'ontouchstart' in window,
        offset: 0,
        refreshRate: 16,
        slideCount: 0,
        transitionstart: 'transitionstart',
        transitionend: 'transitionend',
        currentHeight: 'auto'
    }),
    mixins: [
        autoplay
    ],
    provide () {
        return {
            carousel: this
        }
    },
    props: {
        adjustableHeight: {
            type: Boolean,
            default: false
        },
        adjustableHeightEasing: {
            type: String
        },
        centerMode: {
            type: Boolean,
            default: false
        },
        easing: {
            type: String,
            validator: function(value) {
                return (
                    ['ease', 'linear', 'ease-in', 'ease-out', 'ease-in-out'].indexOf(value) !== -1 || value.includes('cubic-bezier')
                )
            },
            default: 'ease'
        },
        loop: {
            type: Boolean,
            default: false
        },
        minSwipeDistance: {
            type: Number,
            default: 8
        },
        mouseDrag: {
            type: Boolean,
            default: true
        },
        touchDrag: {
            type: Boolean,
            default: true
        },
        navigateTo: {
            type: [Number, Array],
            default: 0
        },
        navigationClickTargetSize: {
            type: Number,
            default: 8
        },
        navigationEnabled: {
            type: Boolean,
            default: false
        },
        navigationNextLabel: {
            type: String,
            default: '&#9654'
        },
        navigationPrevLabel: {
            type: String,
            default: '&#9664'
        },
        paginationActiveColor: {
            type: String,
            default: '#000000'
        },
        paginationColor: {
            type: String,
            default: '#cecece'
        },
        paginationEnabled: {
            type: Boolean,
            default: true
        },
        paginationPadding: {
            type: Number,
            default: 10
        },
        paginationPosition: {
            type: String,
            default: 'bottom'
        },
        paginationSize: {
            type: Number,
            default: 15
        },
        perPage: {
            type: Number,
            default: 2
        },
        perPageCustom: {
            type: Array
        },
        resistanceCoef: {
            type: Number,
            default: 20
        },
        scrollPerPage: {
            type: Boolean,
            default: true
        },
        spacePadding: {
            type: Number,
            default: 0
        },
        spacePaddingMaxOffsetFactor: {
            type: Number,
            default: 0
        },
        speed: {
            type: Number,
            default: 500
        },
        tagName: {
            type: String,
            default: 'slide'
        },
        value: {
            type: Number
        },
        maxPaginationDotCount: {
            type: Number,
            default: -1
        },
        rtl: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        value(val) {
            if (val !== this.currentPage) {
                this.goToPage(val);
                this.render();
            }
        },
        navigateTo: {
            immediate: true,
            handler(val) {
                if (typeof val === 'object') {
                    if (val[1] == false) {
                        this.dragging = true
                        
                        setTimeout(() => {
                            this.dragging = false
                        }, this.refreshRate)
                    }

                    this.$nextTick(() => {
                        this.goToPage(val[0])
                    })
                } else {
                    this.$nextTick(() => {
                        this.goToPage(val)
                    })
                }
            }
        },
        currentPage (val) {
            this.$emit('pageChange', val)
            this.$emit('page-change', val)
            this.$emit('input', val)
        },
        autoplay (val) {
            if (val === false) {
                this.pauseAutoplay()
            } else {
                this.restartAutoplay()
            }
        }
    },
    computed: {
        breakpointSlidesPerPage () {
            if (!this.perPageCustom) {
                return this.perPage;
            }
            const breakpointArray = this.perPageCustom
            const width = this.browserWidth
            const breakpoints = breakpointArray.sort(
                (a, b) => (a[0] > b[0] ? -1 : 1)
            )
            // Reduce the breakpoints to entries where the width is in range
            // The breakpoint arrays are formatted as [widthToMatch, numberOfSlides]
            const matches = breakpoints.filter(breakpoint => width >= breakpoint[0])
            // If there is a match, the result should return only
            // the slide count from the first matching breakpoint
            const match = matches[0] && matches[0][1]
            return match || this.perPage
        },
        canAdvanceForward () {
            return this.loop || this.offset < this.maxOffset
        },
        canAdvanceBackward () {
            return this.loop || this.currentPage > 0
        },
        currentPerPage () {
            return !this.perPageCustom || this.$isServer
                ? this.perPage
                : this.breakpointSlidesPerPage
        },
        currentOffset () {
            if (this.isCenterModeEnabled) {
                return 0
            } else if (this.rtl) {
                return (this.offset - this.dragOffset) * 1
            } else {
                return (this.offset + this.dragOffset) * -1
            }
        },
        isHidden () {
            return this.carouselWidth <= 0;
        },
        maxOffset () {
            return Math.max(
                this.slideWidth * (this.slideCount - this.currentPerPage) -
                this.spacePadding * this.spacePaddingMaxOffsetFactor,
                0
            )
        },
        pageCount () {
            return this.scrollPerPage
                ? Math.ceil(this.slideCount / this.currentPerPage)
                : this.slideCount - this.currentPerPage + 1
        },
        slideWidth () {
            const width = this.carouselWidth - this.spacePadding * 2
            const perPage = this.currentPerPage
            return width / perPage
        },
        isNavigationRequired () {
            return this.slideCount > this.currentPerPage
        },
        isCenterModeEnabled () {
            return this.centerMode && !this.isNavigationRequired
        },
        transitionStyle () {
            const speed = `${this.speed / 1000}s`
            const transtion = `${speed} ${this.easing} transform`
            if (this.adjustableHeight) {
                return `${transtion}, height ${speed} ${this.adjustableHeightEasing ||
                this.easing}`
            }
            return transtion
        },
        padding () {
            const padding = this.spacePadding
            return padding > 0 ? padding : false
        }
    },
    methods: {
        getNextPage () {
            if (this.currentPage < this.pageCount - 1) {
                return this.currentPage + 1
            }
            return this.loop ? 0 : this.currentPage
        },
        getPreviousPage () {
            if (this.currentPage > 0) {
                return this.currentPage - 1
            }
            return this.loop ? this.pageCount - 1 : this.currentPage
        },
        advancePage (direction) {
            if (direction && direction === 'backward' && this.canAdvanceBackward) {
                this.goToPage(this.getPreviousPage(), 'navigation')
            } else if (
                (!direction || (direction && direction !== 'backward')) &&
                this.canAdvanceForward
            ) {
                this.goToPage(this.getNextPage(), 'navigation')
            }
        },
        goToLastSlide () {
            this.dragging = true

            setTimeout(() => {
                this.dragging = false
            }, this.refreshRate)

            this.$nextTick(() => {
                this.goToPage(this.pageCount)
            })
        },
        attachMutationObserver() {
            const MutationObserver =
                window.MutationObserver ||
                window.WebKitMutationObserver ||
                window.MozMutationObserver
            if (MutationObserver) {
                let config = {
                    attributes: true,
                    data: true
                }
                if (this.adjustableHeight) {
                    config = {
                        ...config,
                        childList: true,
                        subtree: true,
                        characterData: true
                    }
                }

                this.mutationObserver = new MutationObserver(() => {
                    this.$nextTick(() => {
                        this.computeCarouselWidth()
                        this.computeCarouselHeight()                        
                    })
                })

                if (this.$parent.$el) {
                    let carouselInnerElements = this.$el.getElementsByClassName('vue-carousel-inner')

                    for (let i = 0; i < carouselInnerElements.length; i++) {
                        this.mutationObserver.observe(carouselInnerElements[i], config)
                    }
                }
            }
        },
        handleNavigation (direction) {
            this.advancePage(direction)
            this.pauseAutoplay()
            this.$emit('navigation-click', direction)
        },
        detachMutationObserver () {
            if (this.mutationObserver) {
                this.mutationObserver.disconnect()
            }
        },
        getBrowserWidth () {
            this.browserWidth = window.innerWidth
            return this.browserWidth
        },
        getCarouselWidth() {
            let carouselInnerElements = this.$el.getElementsByClassName('vue-carousel-inner')

            for (let i = 0; i < carouselInnerElements.length; i++) {
                if (carouselInnerElements[i].clientWidth > 0) {
                    this.carouselWidth = carouselInnerElements[i].clientWidth || 0
                }
            }

            return this.carouselWidth
        },
        getCarouselHeight() {
            if (!this.adjustableHeight) {
                return "auto";
            }
            const slideOffset = this.currentPerPage * (this.currentPage + 1) - 1;
            const maxSlideHeight = [...Array(this.currentPerPage)]
                .map((_, idx) => this.getSlide(slideOffset + idx))
                .reduce(
                (clientHeight, slide) =>
                    Math.max(clientHeight, (slide && slide.$el.clientHeight) || 0),
                0
                );
            this.currentHeight =
                maxSlideHeight === 0 ? "auto" : `${maxSlideHeight}px`;
            return this.currentHeight;
        },
        getSlideCount() {
            this.slideCount =
                (this.$slots &&
                this.$slots.default &&
                this.$slots.default.filter(
                    slot =>
                    slot.tag &&
                    slot.tag.match(`^vue-component-\\d+-${this.tagName}$`) !== null
                ).length) || 0
        },
        getSlide(index) {
            const slides = this.$children.filter(
                child =>
                child.$vnode.tag.match(`^vue-component-\\d+-${this.tagName}$`) !==
                null
            );
            return slides[index];
        },
        goToPage(page, advanceType) {
            if (page >= 0 && page <= this.pageCount) {
                this.offset = this.scrollPerPage
                ? Math.min(
                    this.slideWidth * this.currentPerPage * page,
                    this.maxOffset
                    )
                : this.slideWidth * page;
                // restart autoplay if specified
                if (this.autoplay && !this.autoplayHoverPause) {
                    this.restartAutoplay();
                }
                // update the current page
                this.currentPage = page;
                if (advanceType === "pagination") {
                    this.pauseAutoplay();
                    this.$emit("pagination-click", page);
                }
            }
        },
        onStart(e) {
            if (e.button == 2) {
                return;
            }
            document.addEventListener(
                this.isTouch ? "touchend" : "mouseup",
                this.onEnd,
                true
            );
            document.addEventListener(
                this.isTouch ? "touchmove" : "mousemove",
                this.onDrag,
                true
            );
            this.startTime = e.timeStamp;
            this.dragging = true;
            this.dragStartX = this.isTouch ? e.touches[0].clientX : e.clientX;
            this.dragStartY = this.isTouch ? e.touches[0].clientY : e.clientY;
        },
        onEnd (e) {
            if (this.autoplay && !this.autoplayHoverPause) {
                this.restartAutoplay()
            }
            this.pauseAutoplay()
            const eventPosX = this.isTouch ? e.changedTouches[0].clientX : e.clientX
            const deltaX = this.dragStartX - eventPosX
            this.dragMomentum = deltaX / (e.timeStamp - this.startTime)

            if (
                this.minSwipeDistance !== 0 &&
                Math.abs(deltaX) >= this.minSwipeDistance
            ) {
                const width = this.scrollPerPage
                ? this.slideWidth * this.currentPerPage
                : this.slideWidth;
                this.dragOffset = this.dragOffset + Math.sign(deltaX) * (width / 2)
            }
            if (this.rtl) {
                this.offset -= this.dragOffset
            } else {
                this.offset += this.dragOffset
            }
            this.dragOffset = 0
            this.dragging = false
            this.render()
        
            document.removeEventListener(
                this.isTouch ? 'touchend' : 'mouseup',
                this.onEnd,
                true
            );

            document.removeEventListener(
                this.isTouch ? 'touchmove' : 'mousemove',
                this.onDrag,
                true
            )
        },
        onDrag (e) {
            const eventPosX = this.isTouch ? e.touches[0].clientX : e.clientX
            const eventPosY = this.isTouch ? e.touches[0].clientY : e.clientY
            const newOffsetX = this.dragStartX - eventPosX
            const newOffsetY = this.dragStartY - eventPosY

            if (this.isTouch && Math.abs(newOffsetX) < Math.abs(newOffsetY)) {
                return
            }

            e.stopImmediatePropagation()
            this.dragOffset = newOffsetX
            const nextOffset = this.offset + this.dragOffset
            if (this.rtl) {
                if (this.offset == 0 && this.dragOffset > 0) {
                    this.dragOffset = Math.sqrt(this.resistanceCoef * this.dragOffset)
                } else if (this.offset == this.maxOffset && this.dragOffset < 0) {
                    this.dragOffset = -Math.sqrt(-this.resistanceCoef * this.dragOffset)
                }
            } else {
                if (nextOffset < 0) {
                    this.dragOffset = -Math.sqrt(-this.resistanceCoef * this.dragOffset)
                } else if (nextOffset > this.maxOffset) {
                    this.dragOffset = Math.sqrt(this.resistanceCoef * this.dragOffset)
                }
            }
        },
        onResize () {
            this.computeCarouselWidth()
            this.computeCarouselHeight()
            this.dragging = true
            this.render()

            setTimeout(() => {
                this.dragging = false
            }, this.refreshRate)
        },
        render () {
            if (this.rtl) {
                this.offset -=
                Math.max(
                    -this.currentPerPage + 1,
                    Math.min(Math.round(this.dragMomentum), this.currentPerPage - 1)
                ) * this.slideWidth;
            } else {
                this.offset +=
                Math.max(
                    -this.currentPerPage + 1,
                    Math.min(Math.round(this.dragMomentum), this.currentPerPage - 1)
                ) * this.slideWidth;
            }
            // & snap the new offset on a slide or page if scrollPerPage
            const width = this.scrollPerPage
                ? this.slideWidth * this.currentPerPage
                : this.slideWidth;
            // lock offset to either the nearest page, or to the last slide
            const lastFullPageOffset =
                width * Math.floor(this.slideCount / (this.currentPerPage - 1));
            const remainderOffset =
                lastFullPageOffset +
                this.slideWidth * (this.slideCount % this.currentPerPage);
            if (this.offset > (lastFullPageOffset + remainderOffset) / 2) {
                this.offset = remainderOffset;
            } else {
                this.offset = width * Math.round(this.offset / width);
            }
            // clamp the offset between 0 -> maxOffset
            this.offset = Math.max(0, Math.min(this.offset, this.maxOffset));
            // update the current page
            this.currentPage = this.scrollPerPage
                ? Math.round(this.offset / this.slideWidth / this.currentPerPage)
                : Math.round(this.offset / this.slideWidth);
        },
        computeCarouselWidth() {
            this.getSlideCount();
            this.getBrowserWidth();
            this.getCarouselWidth();
            this.setCurrentPageInBounds();
        },
        computeCarouselHeight() {
            this.getCarouselHeight();
        },
        setCurrentPageInBounds() {
            if (!this.canAdvanceForward && this.scrollPerPage) {
                const setPage = this.pageCount - 1;
                this.currentPage = setPage >= 0 ? setPage : 0;
                this.offset = Math.max(0, Math.min(this.offset, this.maxOffset));
            }
        },
        handleTransitionStart () {
            this.$emit('transitionStart')
            this.$emit('transition-start')
        },
        handleTransitionEnd () {
            this.$emit('transitionEnd')
            this.$emit('transition-end')
        }
    },
    mounted () {
        window.addEventListener('resize', debounce(this.onResize, this.refreshRate))

        if ((this.isTouch && this.touchDrag) || this.mouseDrag) {
            this.$refs['vue-carousel-wrapper'].addEventListener(
                this.isTouch ? 'touchstart' : 'mousedown',
                this.onStart
            )
        }

        this.attachMutationObserver()
        this.computeCarouselWidth()
        this.computeCarouselHeight()
        this.transitionstart = getTransitionEnd()
        this.$refs['vue-carousel-inner'].addEventListener(
            this.transitionstart,
            this.handleTransitionStart
        )
        this.transitionend = getTransitionEnd()
        this.$refs['vue-carousel-inner'].addEventListener(
            this.transitionend,
            this.handleTransitionEnd
        )
        this.$emit('mounted')

        if (this.autoplayDirection === 'backward') {
            this.goToLastSlide()
        }
    },
    beforeDestroy() {
        this.detachMutationObserver()

        window.removeEventListener('resize', this.getBrowserWidth)
            this.$refs["vue-carousel-inner"].removeEventListener(
            this.transitionstart,
            this.handleTransitionStart
        )

        this.$refs["vue-carousel-inner"].removeEventListener(
            this.transitionend,
            this.handleTransitionEnd
        )

        this.$refs["vue-carousel-wrapper"].removeEventListener(
            this.isTouch ? "touchstart" : "mousedown",
            this.onStart
        )
    }
}
</script>