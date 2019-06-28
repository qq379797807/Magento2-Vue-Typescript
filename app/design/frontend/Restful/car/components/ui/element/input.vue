<template>
    <div :class="`${prefix}-form-input`">
        <label :class="`${prefix}-form-label`" :for="label" v-text="label"></label>
        <input v-bind="$attrs" 
            :value="value"
            :type="inputType"
            :class="{'disabled': disabled, [prefix + '-input-control']: true}"
            :disabled="disabled"
            @input="_input"
            @focus="_focus"
            @blur="_blur" />
        <i :class="`${prefix}-icon-clear`" v-if="clear&&value" @click.stop="_clear"></i>
        <i :class="[prefix+'-icon-eye',{ 'eye-show': eye }]" v-if="value && showEye && type==='password'" @click.stop="eye=!eye"></i>
    </div>
</template>

<script>
const prefix = 'v'

export default {
    name: `${prefix}-input`,
    data: () => ({
        prefix: prefix,
        eye: false
    }),
    inheritAttrs: false,
    watch: {
        eye (value) {
            this.inputType = value ? 'text' : 'password'
        }
    },
    props: {
        value: null,
        label: {
            type: String,
            required: true
        },
        disabled: {
            type: Boolean,
            default: false
        },
        inputType: {
            type: String,
            default: 'text'
        },
        validateEvent: {
            type: Boolean,
            default: true
        },
        clear: {
            type: Boolean,
            default: false
        },
        showEye: {
            type: Boolean,
            default: false
        },
        change: Function,
        focus: Function,
        blur: Function
    },
    methods: {
        _blur (e) {
            if (this.validateEvent) {
                // this.dispatch('formItem', `${prefix}.form.blur`, [e])
            }
            this._emit('blur', e)
            this.blur && this.blur(e)
        },
        _input (e) {
            const value = e.target.value
            this.$emit('input', value)
            this.change && this.change(e)
            if (this.validateEvent) {
                // this.dispatch('formItem', `${prefix}.form.change`, [value, e])
            }
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