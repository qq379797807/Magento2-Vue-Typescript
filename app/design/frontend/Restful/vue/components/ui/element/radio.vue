<template>
    <label :class="{
        'disabled': disabled,
        'checked': isChecked === modelValue, [prefix+'-radio']: true}">
        <input type="radio" v-bind="$attrs" :checked="state" :value="isChecked" :disabled="disabled" @change="_onChange" />
        <span class="radio-inner"></span>
        <span class="radio-text"><slot/></span>
    </label>
</template>

<script>
const prefix = 'v'

export default {
    name: `${prefix}-radio`,
    inheritAttrs: false,
    data: () => ({
        prefix: prefix,
        isChecked: null,
        modelValue: null,
        state: false
    }),
    props: {
        value: null,
        checked: String,
        disabled: {
            type: Boolean,
            default: false
        },
        change: Function
    },
    watch: {
        value (v) {
            this.modelValue = v
        },
        state () {
            return this.isChecked === this.modelValue ? true : false
        }
    },
    mounted () {
        if (this.checked) {
            this.isChecked = this.checked
        } else {
            if (this.value) {
                this.isChecked = this.value
            }
        }
        this.modelValue = this.value
        this.state = this.isChecked === this.modelValue ? true : false
    },
    methods: {
        _onChange (e) {
            let emitValue = e.target.value || true
            if (!this.checked) {
                this.isChecked = true
            }
            this.$emit('input', emitValue)
            this.change && this.change(emitValue)
        }
    }
}
</script>