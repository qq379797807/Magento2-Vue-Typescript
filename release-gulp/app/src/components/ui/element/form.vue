<template>
    <form :class="`${prefix}-form`" v-bind="$attrs">
        <slot></slot>
    </form>
</template>

<script>
const prefix = 'v'

export default {
    name: `${prefix}-form`,
    inheritAttrs: false,
    data: () => ({
        prefix: prefix,
        defaultModel: {}
    })
}
</script>