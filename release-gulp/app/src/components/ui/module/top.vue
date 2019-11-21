<template>
    <div
        :class="`${prefix}-top`"
        :style="{bottom: `${defaultBottom}px`, right: `${defaultRight}px`}"
        v-show="showIcon">
        <i
            :class="types[defaultType]"
            :style="{fontSize: `${defaultSize}px`, color: defaultColor}"
            @click="goTop()"></i>
    </div>
</template>

<script>
const prefix = 'v'

export default {
    name: `${prefix}-back-top`,
    props: [
        'type',
        'top',
        'right',
        'bottom',
        'size',
        'color',
        'duration',
        'container'
    ],
    data: () => ({
        prefix: prefix,
        showIcon: false,
        scrollTop: 0,
        types: [
            'icon icon-backtop'
        ],
        defaultType: 0,
        defaultTop: 400,
        defaultRight: 30,
        defaultBottom: 30,
        defaultSize: 40,
        defaultColor: '#666',
        defaultDuration: 300,
        defaultContainer: document.documentElement || document.body
    }),
    mounted () {
        this.type ? (this.defaultType = this.type) : ''
        this.top ? (this.defaultTop = this.top) : ''
        this.right ? (this.defaultRight = this.right) : ''
        this.bottom ? (this.defaultBottom = this.bottom) : ''
        this.size ? (this.defaultSize = this.size) : ''
        this.color ? (this.defaultColor = this.color) : ''
        this.duration ? (this.defaultDuration = this.duration) : ''

        this.$nextTick(() => {
            this.defaultContainer = document.querySelector(this.container) || this.defaultContainer
            window.addEventListener('scroll', this.handelScroll, false)
        })
    },
    beforeDestroy () {
        window.removeEventListener('scroll', this.handelScroll, false)
    },
    methods: {
        handelScroll () {
            this.scrollTop = this.defaultContainer.scrollTop || window.pageYOffset || this.defaultContainer.scrollTop
            this.scrollTop > this.defaultTop ? (this.showIcon = true) : (this.showIcon = false)
        },
        goTop () {
            window.requestAnimationFrame = (() => {
                return (
                    window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    function (callback) {
                        window.setTimeout(callback, 1000 / 60)
                    }
                )
            })()

            let step = (this.scrollTop / (this.defaultDuration / (1000 / 60))) >> 0

            const fn = () => {
                if (this.scrollTop >= 0) {
                    this.scrollTop -= step
                    this.defaultContainer.scrollTop = this.scrollTop
                    fn.rafTimer = requestAnimationFrame(fn)
                } else {
                    this.defaultContainer.scrollTop = 0
                    cancelAnimationFrame(fn.rafTimer)
                }
            }

            fn.rafTimer = requestAnimationFrame(fn)
        }
    }
}
</script>