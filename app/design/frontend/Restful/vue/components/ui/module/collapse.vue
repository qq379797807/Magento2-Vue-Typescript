<template>
    <div class="v-collapse">
        <slot></slot>
    </div>
</template>

<script>
const prefix = 'v'

export default {
    name: `${prefix}-collapse`,
    data: () => ({
        active: [],
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
    mounted () {
        this.active.push(this.value)
    },
    methods: {
        _change (v) {
            this.change && this.change(v)
        }
    }
}
</script>