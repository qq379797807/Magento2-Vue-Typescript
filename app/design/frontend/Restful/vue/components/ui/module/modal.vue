<template>
    <transition :name="animation">
        <div :class="`${prefix}-modal`"  v-if="showHide">
            <div :class="{[prefix + '-modal-container']: true, [classes]: classes}"
                :style="{
                    zIndex: zIndex,
                    left: style.left,
                    top: style.top
                }">
                <a href="javascript:;" :class="`${prefix}-modal-close ${prefix}-icon-close`" v-if="showClose" @click="_close"></a>
                <div :class="`${prefix}-modal-auto-close`" v-if="autoClose > 0">
                    <span v-text="i18n.autoClose"></span>
                    <span v-text="autoTime"></span>
                    <span v-text="i18n.seconds"></span>
                </div>
                <div :class="`${prefix}-modal-header`" :style="{cursor: move?'move':''}" ref="head"
                    v-if="title || $slots.title" @mousedown="_mouseDown">
                    <template v-if="title">{{title}}</template>
                    <slot name="title" v-else></slot>
                </div>
                <div v-if="$slots.default"
                    :style="scrollStyle"
                    :class="{
                        [prefix+'-modal-content']: true
                    }">
                    <slot></slot>
                </div>
                <div :class="`${prefix}-modal-footer`" v-if="confirm||cancel">
                    <v-button type="cancel" v-if="cancel" @click="_cancel">{{cancel}}</v-button>
                    <v-button type="primary" v-if="confirm" @click="_confirm">{{confirm}}</v-button>
                </div>
            </div>
            <div :class="`${prefix}-modal-overlay`" @click="_modalClick"></div>
        </div>
    </transition>
</template>

<script>
const prefix = 'v'
import VButton from '../element/button'

export default {
    name: `${prefix}-modal`,
    data: () => ({
        i18n: {
            autoClose: 'Automatic shutdown after',
            seconds: 'seconds'
        },
        prefix: prefix,
        autoTime: 0,
        scrollStyle: '',
        scrollbarWidth: 0,
        modalWidth: 0,
        modalHeight: 0,
        windowHeight: 0,
        windowWidth: 0,
        zIndex: 300,
        showHide: false,
        clearTime: '',
        style: {
            left: '',
            top: ''
        }
    }),
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        title: String,
        appendToBody: {
            type: Boolean,
            default: true
        },
        width: Number,
        height: Number,
        modal: {
            type: Boolean,
            default: true
        },
        closeModal: {
            type: Boolean,
            default: true
        },
        lockScroll: {
            type: Boolean,
            default: true
        },
        classes: String,
        showClose: {
            type: Boolean,
            default: true
        },
        confirm: String,
        cancel: String,
        move: {
            type: Boolean,
            default: true
        },
        autoClose: {
            type: Number,
            default: 0
        },
        beforeClose: Function,
        callback: Function,
        animation: {
            type: String,
            default: 'zoom'
        },
        after: Function,
        center: {
            type: Boolean,
            default: true
        },
        type: {
            type: Number,
            default: 0
        }
    },
    components: {
        VButton
    },
    watch: {
        visible (v) {
            this.showHide = this.visible
            if (v) {
                this.$nextTick(() => {
                    this._setPosition()
                    this._openModal()
                })
            }
        }
    },
    created () {
        this.scrollbarWidth = this.getScrollbarWidth()
    },
    mounted () {
        this.$nextTick(() => {
            if (this.appendToBody && this.$el) {
                document.body.appendChild(this.$el)
            }
            this.showHide = this.visible
            this.after && this.after()

            window.addEventListener('resize', () => {
                if (this.showHide) this._setPosition()
            })
        })
    },
    methods: {
        _mouseDown (ev) {
            let head = this.$refs.head
            if (this.move && head) {
                let flag = false
                let offSet = this.getOffset(this.$el.firstChild)
                let x = ev.pageX - offSet.left
                let y = ev.pageY - offSet.top
                const scrollTop = this.scrollTop()
                flag = true

                document.onmousemove = (ev) => {
                    if (flag) {
                        let left = ev.pageX - x
                        let top = ev.pageY - y - scrollTop
                        if (left <= 0) {
                            left = 0
                        } else if (left > this.windowWidth - this.modalWidth) {
                            left = this.windowWidth - this.modalWidth
                        }
                        if (top <= 0) {
                            top = 0
                        } else if (top > this.windowHeight - this.modalHeight) {
                            top = this.windowHeight - this.modalHeight
                        }

                        this.$el.firstChild.style.left = left + 'px'
                        this.$el.firstChild.style.top = top + 'px'
                    }
                    return false
                }

                document.onmouseup = () => {
                    document.onmousemove = null
                    document.onmouseup = null
                    flag = false
                }
            }
        },
        _close () {
            this._beforeClose('close')
        },
        _cancel () {
            this._beforeClose('cancel')
        },
        _confirm () {
            this._beforeClose('confirm')
        },
        _beforeClose (type) {
            if (this.autoClose) {
                clearInterval(this.clearTime)
            }
            if (typeof this.callback === 'function') {
                this.callback(this._hide)
                return false
            }
            if (typeof this.beforeClose === 'function') {
                this.beforeClose(type, this._hide)
            } else {
                this._hide()
            }
        },
        _hide () {
            if (this.lockScroll) {
                const num = document.querySelectorAll(`.${prefix}-modal`)
                if (num.length === 1) {
                    document.body.style = ''
                }
            }

            this.$emit('update:visible', false)
            this.showHide = false
        },
        _setPosition () {
            const target = this.$el.firstChild
            const clone = target.cloneNode(true)
            clone.style.display = 'block'
            clone.style.position = 'absolute'
            clone.style.top = '-10000px'
            target.parentNode.appendChild(clone)
            this.modalWidth = this.width || clone.offsetWidth
            this.modalHeight = this.height || clone.offsetHeight
            this.windowHeight = this.getWindow().height
            this.windowWidth = this.getWindow().width
        
            if (this.width) {
                target.style.width = this.width + 'px'
            }

            if (this.center) {
                let top = (this.windowHeight - this.modalHeight) / 2
                if (top < 0) {
                    top = 0
                }
                this.style.left = (this.windowWidth - this.modalWidth) / 2 + 'px'
                this.style.top = top + 'px'
            }

            if (this.height || this.windowHeight < this.modalHeight) {
                const header = clone.querySelector(`.${prefix}-modal-header`)
                let titleHeight = 0
                if (header) {
                    titleHeight = header.offsetHeight
                }

                let footerHeight = 0
                const footer = clone.querySelector(`.${prefix}-modal-footer`)
                if (footer) {
                    footerHeight = footer.offsetHeight
                }

                let scrollHeight = this.modalHeight
                if (this.height) {
                    scrollHeight = this.height
                } else {
                    scrollHeight = this.windowHeight
                }
               
                this.scrollStyle = {
                    height: Math.ceil(scrollHeight - titleHeight - footerHeight) + 'px',
                    overflowY: 'auto'
                }
            }
            target.parentNode.removeChild(clone)
        },
        _openModal () {
            if (this.lockScroll) {
                document.body.style.overflow = 'hidden'
                document.body.style.paddingRight = this.scrollbarWidth + 'px'
            }

            this._autoClose()
        },
        _modalClick (e) {
            this._beforeClose('close')
        },
        _autoClose () {
            if (this.autoClose > 0) {
                this.autoTime = this.autoClose
                this.clearTime = setInterval(() => {
                    if (this.autoTime > 1) {
                        this.autoTime--
                    } else {
                        this._close()
                    }
                }, 1000)
            }
        },
        open () {
            this.showHide = true
            this._openModal()
        },
        close () {
            this._hide()
        },
        setPosition () {
            this.$nextTick(() => {
                const modalHeight = this.$el.offsetHeight
                let top = (this.windowHeight - modalHeight) / 2
                if (top < 0) {
                    top = 0
                }
                this.style.top = top + 'px'
                if (modalHeight > this.windowHeight) {
                    const header = this.$el.querySelector(`.${prefix}-modal-header`)
                    const footer = this.$el.querySelector(`.${prefix}-modal-footer`)
                    const headerHeight = header ? header.offsetHeight : 0
                    const footerHeight = footer ? footer.offsetHeight : 0
                    this.scrollStyle = {
                        height: Math.ceil(this.windowHeight - headerHeight - footerHeight) + 'px',
                        overflowY: 'auto'
                    }
                }
            })
        },
        scrollTop () {
            return document.documentElement.scrollTop || document.body.scrollTop
        },
        getOffset (el) {
            const componentRect = el.getBoundingClientRect()
            const top = componentRect.top + (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0)
            const left = componentRect.left + (window.pageXOffset || document.documentElement.scrollLeft) - (document.documentElement.clientLeft || 0)
            const width = el.offsetWidth
            const height = el.offsetHeight

            return {
                left: left, 
                top: top, 
                width: width, 
                height: height
            }
        },
        getWindow () {
            const width = document.documentElement.clientWidth || document.body.clientWidth
            const height = document.documentElement.clientHeight || document.body.clientHeight
            return {
                width: width, 
                height: height
            }
        },
        getScrollbarWidth () {
            const hasScroll = document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight)
            if (hasScroll) {
                const scrollDiv = document.createElement('div')
                scrollDiv.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;'
                document.body.appendChild(scrollDiv)
                const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
                document.body.removeChild(scrollDiv)
                return scrollbarWidth
            }
        }
    },
    destroyed () {
        if (this.appendToBody && this.$el && this.$el.parentNode) {
            this.$el.parentNode.removeChild(this.$el)
            document.body.style = ''
            this.scrollbarWidth = 0
        }
        window.dispatchEvent(new Event('resize'))
    }
}
</script>