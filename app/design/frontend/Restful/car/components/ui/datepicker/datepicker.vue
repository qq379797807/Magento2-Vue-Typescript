<template>
    <div :class="{[prefix + '-date-picker-input']: true, 'date-picker-clear': value && showClear}">
        <v-input
            :placeholder="placeholder"
            :class="{'disabled': disabled}"
            ref="input"
            :value="value"
            :disabled="disabled"
            :clear="showClear&&!disabled"
            @input="_input">
        </v-input>
        <i :class="`${prefix}-icon-date`" v-if="!disabled"></i>
    </div>
</template>

<script>
import Vue from 'vue'
import Picker from './picker'
import VInput from '../element/input'
const Datepicker = Vue.extend(Picker)
const prefix = 'v'

export default {
    name: `${prefix}-datepicker`,
    data: () => ({
        prefix: prefix,
        component: '', 
        offset: {}, 
        status: false
    }),
    props: {
        value: [String, Number, Date],
        placeholder: String,
        showClear: {
            type: Boolean,
            default: true
        },
        disabledDate: {
            type: Function,
            default: () => {
                return false
            }
        },
        disabled: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: 'ymd',
            validator: (value) => {
                return ['y', 'ym', 'ymd', 'ymdHms'].indexOf(value) !== -1
            }
        },
        change: Function,
        innerHTML: Function
    },
    components: {
        Datepicker, 
        VInput
    },
    mounted () {
        document.addEventListener('click', this._open)
    },
    methods: {
        _open (e) {
            if (this.$el.contains(e.target) && !this.disabled && !this.status) {
                this.offset = this.getOffset(this.$refs.input.$el)
                const props = {
                    offset: this.offset,
                    value: this.value,
                    input: (time) => {
                        const value = this._format(time)
                        this.$emit('input', value)
                        this.change && this.change(value)
                        this.status = false
                    },
                    disabledDate: (time) => {
                        return this.disabledDate && this.disabledDate(time)
                    },
                    type: this.type,
                    innerHTML: (time) => {
                        return this.innerHTML && this.innerHTML(time)
                    }
                }

                const propsData = Object.assign({}, props)
                this.component = new Datepicker({propsData}).$mount()
                document.body.appendChild(this.component.$el)
                this.status = true
            } else {
                if (this.component) {
                    this.component.close()
                    this.status = false
                }
            }
        },
        _input () {
            this.$emit('input', '')
        },
        _format (dateString) {
            const date = new Date(dateString)
            const year = date.getFullYear()
            const month = this._setNum(date.getMonth() + 1)
            const day = this._setNum(date.getDate())
            const timer = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
            let time = ''

            switch (this.type) {
                case 'y':
                time = year
                break
                case 'ym':
                time = year + '-' + month
                break
                case 'ymd':
                time = year + '-' + month + '-' + day
                break
                case 'ymdHms':
                time = year + '-' + month + '-' + day + ' ' + timer
                break
            }
            return time
        },
        _setNum (num) {
            if (parseInt(num) < 10) {
                return '0' + num
            } else {
                return num
            }
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
        }
    },
    beforeDestroy () {
        document.removeEventListener('click', this._open)
    },
    destroyed () {
        if (this.$el && this.$el.parentNode) {
            this.$el.parentNode.removeChild(this.$el)
        }
    }
}
</script>