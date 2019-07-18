<template>
    <div :class="`${prefix}-swiper-container`"
        style="position: relative;overflow: hidden"
        ref="container"
        @touchstart="_touchStart"
        @touchmove="_touchMove"
        @touchend="_touchEnd"
        @touchcancel="_touchEnd"
        @mouseover="_mouseOver"
        @mouseleave="_mouseLeave">
        <div class="swiper-wrapper" :style="styleWrap">
            <slot/>
        </div>
        <div class="direction-nav" v-if="directionNav && swipes.length > 1">
            <a href="javascript:;" class="swiper-prev" @click="_directionNavClick(-1)"></a>
            <a href="javascript:;" class="swiper-next" @click="_directionNavClick(1)"></a>
        </div>
        <div class="control-nav" v-if="controlNav && swipes.length > 1">
            <a href="javascript:;"
                v-for="(item,index) in swipes"
                :class="{'control-nav-active':index===current}"
                :key="index" @click="_controlNavClick(index)"></a>
        </div>
    </div>
</template>

<script>
const prefix = 'v'

export default {
    name: `${prefix}-swiper`,
    data: () => ({
        prefix: prefix,
        containerWidth: '', 
        containerHeight: '',
        swipes: [],
        translate: 0,
        durationT: '',
        startX: 0,
        current: 0,
        timer: ''
    }),
    props: {
        active: {
            type: Number,
            default: 0
        },
        showTime: {
            type: Number,
            default: 3000
        },
        autoPlay: {
            type: Boolean,
            default: true
        },
        slideBefore: Function,
        slideAfter: Function,
        distance: {
            type: Number,
            default: 50
        },
        duration: {
            type: Number,
            default: 500
        },
        controlNav: {
            type: Boolean,
            default: true
        },
        directionNav: {
            type: Boolean,
            default: true
        },
        pauseOnHover: {
            type: Boolean,
            default: true
        },
        touch: {
            type: Boolean,
            default: false
        },
        animation: {
            default: 'slide',
            validator: function (value) {
                return ['fade', 'slide'].indexOf(value) !== -1
            }
        }
    },
    computed: {
        styleWrap () {
            let animation = {
                transform: `translate3d(${this.translate}px,0,0)`,
                transition: `transform ${this.durationT}ms`
            }
            if (this.animation === 'fade') {
                animation = {
                    height: this.containerHeight + 'px',
                    overflow: 'hidden',
                    position: 'relative'
                }
            }
            return animation
        }
    },
    watch: {
        active (v) {
            this.current = v
            this._translate(v)
        }
    },
    mounted () {
        this.current = this.active
        this.containerWidth = this.$refs.container.offsetWidth
        this.containerHeight = this.$refs.container.offsetHeight
        this._translate(this.current)
        this._autoPlay()
    },
    updated () {
        console.log()
    },
    methods: {
        _getTouch (event) {
            return event.changedTouches[0] || event.touches[0]
        },
        _touchStart (event) {
            if (!this.touch || this.animation === 'fade') {
                return
            }
            clearInterval(this.timer)
            const touch = this._getTouch(event)
            this.startX = touch.clientX
            event.preventDefault()
        },
        _touchMove (event) {
            if (!this.touch || this.animation === 'fade') {
                return
            }
            const touch = this._getTouch(event)
            const distance = touch.clientX - this.startX
            this._setItem(-distance)
            this.durationT = 0
            this.translate = -this.containerWidth * this.current + distance
            event.preventDefault()
        },
        _touchEnd (event) {
            if (!this.touch || this.animation === 'fade') {
                return
            }
            const index = this.current
            this._slideBefore(index)
            const touch = this._getTouch(event)
            const distance = touch.clientX - this.startX
            if (Math.abs(distance) > this.distance) {
                if (distance > 0) {
                    this.current--
                } else if (distance < 0) {
                    this.current++
                }

                const len = this.swipes.length - 1

                if (this.current < 0) {
                    this._setCurrent(len)
                }
                if (this.current > this.swipes.length - 1) {
                    this._setCurrent(0)
                }
            }
            this._translate(this.current)
            this._slideAfter(index)
            this._autoPlay()
        },
        _setCurrent (current) {
            setTimeout(() => {
                this.current = current
                this.swipes[current].offset = 0
                this._translate(current, 0)
            }, this.duration)
        },
        _translate (current, duration) {
            this.durationT = duration === 0 ? 0 : this.duration
            this.translate = -this.containerWidth * current
            if (this.animation === 'fade') {
                this._swipesActive(current)
            }
        },
        _swipesActive (current) {
            let len = this.swipes.length
            if (current > len - 1) {
                this.current = 0
            }
            if (current < 0) {
                this.current = len - 1
            }

            for (let i = 0; i < len; i++) {
                this.swipes[i].active = i === this.current
            }
        },
        _directionNavClick (direction) {
            this._slideBefore(this.current)
            
            if (this.animation === 'slide') {
                const item = this._setItem(direction)
                const moveFirstOrLast = item[0]
                const index = item[1]
                this.current = this.current + direction
                this._translate(this.current)

                if (moveFirstOrLast) {
                    this.current = index
                    setTimeout(() => {
                        this._translate(index, 0)
                        this.swipes[index].offset = 0
                    }, this.duration)
                }
            } else {
                this.current = this.current + direction
                this._translate(this.current)
            }

            this._slideAfter(this.current)
        },
        _controlNavClick (index) {
            this._slideBefore(index)
            this.current = index
            this._translate(index)
            this._slideAfter(index)
        },
        _setItem (direction) {
            const len = this.swipes.length
            const offset = this.containerWidth * len
            let moveFirstOrLast = false
            let index = this.current

            if (direction > 0 && this.current >= len - 1) {
                this.swipes[0].offset = offset
                moveFirstOrLast = true
                index = 0
            }
            if (direction < 0 && this.current <= 0) {
                this.swipes[len - 1].offset = -offset
                moveFirstOrLast = true
                index = len - 1
            }

            return [moveFirstOrLast, index]
        },
        _autoPlay () {
            if (this.autoPlay && this.swipes.length > 1) {
                this.timer = setInterval(() => {
                    this._directionNavClick(1)
                }, this.showTime)
            }
        },
        _slideBefore (index) {
            this.slideBefore && this.slideBefore(index)
            this.$emit('slideBefore', index)
        },
        _slideAfter (index) {
            setTimeout(() => {
                this.slideAfter && this.slideAfter(index)
                this.$emit('slideAfter', index)
            }, this.duration)
        },
        _mouseOver () {
            if (this.pauseOnHover && this.autoPlay) {
                clearInterval(this.timer)
            }
        },
        _mouseLeave () {
            this._autoPlay()
        }
    }
}
</script>