<template>
    <div class="swiper-slide" :style="style" :class="{'active':active}">
        <slot/>
    </div>
</template>

<script>
const prefix = 'v'

export default {
    name: `${prefix}-swiper-item`,
    data: () => ({
        offset: 0,
        active: false
    }),
    computed: {
        style () {
            let animation = {
                width: this.$parent.containerWidth + 'px',
                float: 'left',
                transform: `translate3d(${this.offset}px, 0, 0)`,
                transition: `transform 0ms`
            }

            if (this.$parent.animation === 'fade') {
                animation = {
                    position: 'absolute',
                    left: '0',
                    top: '0',
                    width: '100%',
                    height: this.$parent.containerHeight + 'px',
                    opacity: this.active ? 1 : 0,
                    transition: `all ${this.$parent.duration}ms`
                }
            }
            
            return animation
        }
    },
    mounted () {
        this.$parent.swipes.push(this)
    }
}
</script>