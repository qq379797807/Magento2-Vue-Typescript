<template>
    <div :class="`${prefix}-qplus`">
        <button type="button" @click="_reduce">
            <i :class="`${prefix}-icon-reduce`"></i>
        </button>
        <input v-bind="$attrs"
            type="number" 
            :value="value"
            :class="{'disabled': disabled, [prefix + '-input-control']: true}"
            :disabled="disabled"
            @input="_input"
            @focus="_focus"
            @blur="_blur" />
        <button type="button" @click="_increase">
            <i :class="`${prefix}-icon-increase`"></i>
        </button>
    </div>
</template>

<script>
const prefix = 'v'

export default {
    name: `${prefix}-qplus`,
    inheritAttrs: false,
    data: () => ({
        prefix: prefix,
        minsV: 1,
        maxsV: 100
    }),
    props: {
        value: {
            type: Number,
            default: 1
        },
        disabled: {
            type: Boolean,
            default: false
        },
        mins: {
            type: Number,
            default: 1
        },
        maxs: {
            type: Number,
            default: 100
        },
        change: Function,
        focus: Function,
        blur: Function
    },
    mounted () {
        this.minsV = this.mins
        this.maxsV = this.maxs
    },
    methods: {
        _blur (e) {
            this._emit('blur', e)
            this.blur && this.blur(e)
        },
        _input (e) {
            const value = Number(e.target.value)

            if (value <= this.minsV) {
                value = this.minsV
            }

            if (value >= this.maxsV) {
                value = this.maxsV
            }
                
            this.$emit('input', value)
            this.change && this.change(value)
        },
        _focus (e) {
            this._emit('focus', e)
            this.focus && this.focus(e)
        },
        _emit (type, e) {
            this.$emit(type, e)
        },
        _reduce () {
            if (this.value > this.minsV) {
                this.value -= 1
                this.$emit('input', this.value)
                this.change && this.change(this.value)
            }
        },
        _increase () {
            if (this.value < this.maxsV) {
                this.value += 1
                this.$emit('input', this.value)
                this.change && this.change(this.value)
            }
        }
    }
}
</script>