<template>
    <div :class="`${prefix}-collapse`">
        <slot></slot>
    </div>
</template>

<script>
const prefix = 'v'

export default {
    name: `${prefix}-collapse`,
    data: () => ({
        active: [this.value],
        panelName: []
    }),
    props: {
        value: String,
        accordion: {
            type: Boolean,
            default: false
        },
        change: Function,
        transition: {
            type: String,
            default: 'collapse'
        }
    },
    methods: {
        _change (v) {
            this.change && this.change(v)
        }
    }
}
</script>