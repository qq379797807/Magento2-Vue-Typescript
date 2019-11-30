<template>
    <validation-observer ref="observer" tag="form" :class="`${prefix}-form`" v-bind="$attrs" @submit.native.prevent="onSubmit">
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
        prefix: prefix
    }),
    components: {
        ValidationObserver
    },
    methods: {
        async validate (callback) {
            const isValid = await this.$refs.observer.validate()
            
            if (isValid) {
                callback()
            }
        },
        async onSubmit () {
            const isValid = await this.$refs.observer.validate()
            
            if (isValid) {
                
            }
        },
        reset () {

        }
    }
}
</script>