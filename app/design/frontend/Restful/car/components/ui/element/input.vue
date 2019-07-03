<template>
    <div :class="`${prefix}-form-input`">
        <input v-bind="$attrs" 
            :value="value"
            :type="inputType"
            :class="{'disabled': disabled, [prefix + '-input-control']: true}"
            :disabled="disabled"
            @input="_input"
            @focus="_focus"
            @blur="_blur" />
        <i :class="`${prefix}-icon-clear`" v-if="clear&&value" @click.stop="_clear"></i>
        <i :class="[prefix+'-icon-eye',{ 'show': eye }]" v-if="value && show && type==='password'" @click.stop="eye=!eye"></i>
    </div>
</template>

<script>
const prefix = 'v'

export default {
    name: `${prefix}-input`,
    inheritAttrs: false,
    data: () => ({
        prefix: prefix,
        eye: false,
        inputType: 'text'
    }),
    props: {
        value: null,
        disabled: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: 'text'
        },
        clear: {
            type: Boolean,
            default: false
        },
        show: {
            type: Boolean,
            default: false
        },
        change: Function,
        focus: Function,
        blur: Function
    },
    watch: {
        eye (value) {
            this.inputType = value ? 'text' : 'password'
        }
    },
    mounted () {
        this.inputType = this.type
    },
    methods: {
        _blur (e) {
            this._emit('blur', e)
            this.blur && this.blur(e)
        },
        _input (e) {
            const value = e.target.value
            this.$emit('input', value)
            this.change && this.change(e)
        },
        _focus (e) {
            this._emit('focus', e)
            this.focus && this.focus(e)
        },
        _clear () {
            this._emit('input', '')
        },
        _emit (type, e) {
            this.$emit(type, e)
        }
    }
}
</script>