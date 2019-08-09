<template>
    <validation-observer ref="observer" tag="form" :class="`${prefix}-form`" v-bind="$attrs" @submit.prevent="onSubmit">
        <slot></slot>
    </validation-observer>
</template>

<script>
const prefix = 'v'
import { ValidationObserver } from 'vee-validate'

export default {
    name: `${prefix}-form`,
    inheritAttrs: false,
    data: () => ({
        prefix: prefix,
        defaultModel: {}
    }),
    components: {
        ValidationObserver
    },
    methods: {
        async submit () {
            const isValid = await this.$refs.observer.validate();
            if (!isValid) {
                console.log(isValid)
            }
        }
    }
}
</script>