<template>
  <label :class="{[prefix+'-checkbox']: true, 'checked': checked, 'disabled': disabled}">
    <input type="checkbox" :disabled="disabled" v-model="checked" :value="value" @change="_change" />
    <span :class="`${prefix}-checkbox-inner`"></span>
    <span :class="`${prefix}-checkbox-text`" v-if="label" v-text="label"></span>
    <span :class="`${prefix}-checkbox-text`" v-else><slot></slot></span>
  </label>
</template>

<script>
const prefix = 'v'

export default {
    name: `${prefix}-checkbox`,
    data: ()  => ({
        prefix: prefix,
        checked: false
    }),
    watch: {
        modelValue () {
            this.checked = this.modelValue
        }
    },
    model: {
        prop: 'modelValue',
        event: 'change'
    },
    props: {
        value: String,
        disabled: {
            type: Boolean,
            default: false
        },
        label: String,
        modelValue: {},
        validateEvent: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        _change (e) {
            this.$emit('change', this.checked)
            if (this.validateEvent) {
                // this.dispatch('formItem', `${prefix}.form.change`, [this.checked, e])
            }
        }
    }
}
</script>