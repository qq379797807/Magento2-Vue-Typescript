<template>
    <label :class="{
        'disabled':disabled,
        'checked':isChecked === modelValue, [prefix+'-radio']: true}">
        <input type="radio" v-bind="$attrs" v-model="modelValue" :value="isChecked" @change="_onChange" :disabled="disabled" />
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
        modelValue: false
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