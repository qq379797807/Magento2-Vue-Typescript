<template>
    <validation-provider :name="name" :rules="rules">
        <template #default="{errors}">
            <div :class="`${prefix}-form-input`">
                <input v-bind="$attrs"
                    :type="inputType"
                    :name="name"
                    :class="{'disabled': disabled, [prefix + '-input-control']: true}"
                    :disabled="disabled"
                    v-model="currentV"
                    @input="_input"
                    @focus="_focus"
                    @blur="_blur" />
                <i :class="`${prefix}-icon-clear`" v-if="clear&&currentV" @click.stop="_clear"></i>
                <i :class="[prefix+'-icon-eye',{ 'show': eye }]" v-if="currentV && show && type==='password'" @click.stop="eye=!eye"></i>
            </div>
            <p :class="`${prefix}-error`" v-if="errors[0]">{{ errors[0] }}</p>
        </template> 
    </validation-provider>
</template>

<script>
const prefix = 'v'
import { ValidationProvider } from 'vee-validate'

export default {
    name: `${prefix}-input`,
    inheritAttrs: false,
    data: () => ({
        prefix: prefix,
        eye: false,
        inputType: 'text',
        currentV: null
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
        name: {
            type: String,
            default: ''
        },
        rules: {
            type: String,
            default: ''
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
    components: {
        ValidationProvider
    },
    watch: {
        eye (value) {
            this.inputType = value ? 'text' : 'password'
        },
        value (v) {
            this.currentV = v
        }
    },
    mounted () {
        this.inputType = this.type
        this.currentV = this.value
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