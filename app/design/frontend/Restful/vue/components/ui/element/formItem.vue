<template>
    <div :class="{[prefix+'-form-item-error']: error, [prefix+'-form-item']: true}">
        <label v-if="label || $slots.label" :class="{[prefix+'-form-label']: true}">
            <slot name="label">{{label}}</slot>
        </label>
        <div :class="`${prefix}-form-box ${classes}`">
            <slot></slot>
            <div :class="`${prefix}-form-tips`" v-text="errorTips" v-if="errorTips"></div>
        </div>
    </div>
</template>

<script>
const prefix = 'v'

export default {
    name: `${prefix}-form-item`,
    data: () => ({
        prefix: prefix,
        rules: {},
        errorTips: '',
        error: false
    }),
    props: {
        classes: {
            type: String,
            default: ''
        },
        label: String,
        prop: String,
        required: {
            type: Boolean,
            default: true
        }
    }
}
</script>