<template>
    <div :class="{'open':show,[prefix+'-select']:true}">
        <div :class="{
            'show-clear':clear&&value.length>0,
            [prefix+'-select-control']:true}" @click="_selectControlClick">
            <input type="text" v-if="filterable"
                :class="{
                [prefix+'-input']:true,
                'focus':show,
                'placeholder':placeholder&&value.length===0,
                'disabled':disabled}"
                :placeholder="placeholder"
                :disabled="disabled"
                @input="_change"
                @blur="_blur"
                :value="keywords"
                ref="input">
            <div :class="{
                [prefix+'-input']:true,
                'focus':show,
                'placeholder':placeholder&&value.length===0,
                'disabled':disabled}"
                v-text="text" v-if="!filterable">
            </div>
            <i :class="{'open':show,[prefix+'-icon-arrow']:true}"></i>
            <i :class="`${prefix}-icon-clear`" v-if="clear && value.length > 0" @click="_clearClick"></i>
        </div>
        <transition name="slide-toggle">
            <div :class="`${prefix}-select-down`" v-show="show && filterOption.length > 0" :style="showLiNum" v-if="!$slots.default">
                <ul>
                    <li v-for="(item,index) in filterOption" @click="_itemClick(item,$event)"
                        :class="{'disabled':item.disabled,'active':_getActive(item),[item.class]:item.class}" ref="li"
                        :key="index">{{item.name || item.value}}</li>
                </ul>
            </div>
            <div :class="`${prefix}-select-down`" v-if="$slots.default" v-show="show">
                <slot></slot>
            </div>
        </transition>
    </div>
</template>

<script>
const prefix = 'v'

export default {
    name: `${prefix}-select`,
    data: () => ({
        prefix: prefix,
        filterOption: [],
        show: false,
        liHeight: '',
        text: '',
        keywords: ''
    }),
    props: {
        value: [Array, String, Number],
        multiple: {
            type: Boolean,
            default: false
        },
        multipleLimit: {
            type: Number,
            default: 0
        },
        placeholder: String,
        showNum: {
            type: Number,
            default: 0
        },
        options: Array,
        change: Function,
        disabled: {
            type: Boolean,
            default: false
        },
        filterable: {
            type: Boolean,
            default: false
        },
        clear: {
            type: Boolean,
            default: false
        },
        validateEvent: {
            type: Boolean,
            default: true
        }
    },
    watch: {
        show (value) {
            if (this.filterable) {
                if (value) {
                    this.$refs.input.focus()
                } else {
                    this.$refs.input.blur()
                }
            }
        },
        value (v) {
            if (this.$slots.default) {
                this.text = v
            }
            this._setFirstText()
        }
    },
    mounted () {
        this._setFirstText()
        document.addEventListener('click', this._showHide)

        if (this.filterable) {
            this.keywords = this.value ? this.text : ''
        }
        this.filterOption = this.options
    },
    methods: {
        _showHide (e) {
            if (this.$el.contains(e.target)) {
                if (!this.disabled) {
                    this.show = true
                }
                this.$nextTick(() => {
                    if (this.$refs.li && this.$refs.li[0]) {
                        this.liHeight = this.$refs.li[0].offsetHeight
                    }
                })
            } else {
                this.show = false
            }
        },
        _itemClick (item, e) {
            if (!item.disabled) {
                if (this.multiple) {
                    let newText = (this.text && this.text !== this.placeholder) ? this.text.split(',') : []

                    if (this.multipleLimit > 0 && this.multipleLimit < newText.length) {
                        return false
                    }

                    let newValue = this.value
                    let activeValue = item.name || item.value
                    let index = newText.indexOf(activeValue)

                    if (index !== -1) {
                        newText.splice(index, 1)
                        newValue.splice(index, 1)
                    } else {
                        newText.push(activeValue)
                        newValue.push(item.value)
                    }

                    this.text = newText.join(',')
                    this._emit(newValue, newText, 1)
                } else {
                    this.text = item.name || item.value
                    this.show = false
                    this._emit(item.value, item.name, 1)
                }
                
                this.keywords = this.text
            }
            e.stopPropagation()
        },
        _setFirstText () {
            if (this.value.toString().length > 0) {
                let text = []
                for (let i in this.options) {
                    const option = this.options[i]
                    if (this.multiple) {
                        if (this.value.indexOf(option.value) !== -1) {
                            text.push(option.name || option.value)
                        }
                    } else {
                        if (option.value === this.value) {
                            this.text = option.name || option.value
                            break
                        }
                    }
                }

                if (this.multiple) {
                    this.text = text.join(',')
                }
            } else {
                if (this.placeholder) {
                    this.text = this.placeholder
                } else {
                    this.text = this.options[0].name || this.options[0].value
                    this._emit(this.text, this.options[0].name, 0)
                }
            }
        },
        _change (e) {
            this.keywords = e.target.value
            let newArray = []
            for (let i in this.options) {
                const value = this.options[i].name || this.options[i].value

                if (value.indexOf(e.target.value) > -1) {
                    newArray.push(this.options[i])
                }
            }
            this.filterOption = newArray
        },
        _blur (e) {
            const value = e.target.value
            const filter = this.options.filter((item) => {
                return (item.name || item.value) === value && !item.disabled
            })
            if (filter.length > 0) {
                const item = filter[0]
                this._emit(item.value, item.name, 1)
                this.text = item.name || item.value
            } else {
                this.keywords = this.value ? this.text : ''
            }
            setTimeout(() => {
                this.filterOption = this.options
            }, 500)
        },
        _getActive (item) {
            if (this.multiple) {
                return this.value.indexOf(item.value) !== -1
            } else {
                return item.value === this.value
            }
        },
        _clearClick (e) {
            const value = this.multiple ? [] : ''
            this._emit(value, '', 1)
            this.keywords = ''
            this.text = this.placeholder
            e.stopPropagation()
        },
        _emit (value, name, type) {
            this.$emit('input', value)
            if (type === 1) {
                this.$emit('change', value, name)
                this.change && this.change(value, name)
            }
        },
        _selectControlClick (e) {
            if (this.show) {
                this.show = false
                e.stopPropagation()
            }
        },
        close () {
            this.$nextTick(() => {
                this.show = false
            })
        }
    },
    computed: {
        showLiNum () {
            if (this.showNum && this.options.length > this.showNum) {
                return {
                    height: this.liHeight * this.showNum + 'px',
                    overflowY: 'auto'
                }
            }
        }
    },
    destroyed () {
        document.removeEventListener('click', this._showHide)
    }
}
</script>