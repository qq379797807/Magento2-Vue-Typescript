<template>
    <button v-bind="$attrs"
        :type="native"
        :class="classStyle"
        :disabled="disabled"
        @click="_handleClick"
        v-if="native">
        <slot></slot>
    </button>
    <a v-bind="$attrs"
        :class="classStyle"
        :href="routerHref"
        @click="_handleClick"
        v-else>
        <slot></slot>
    </a>
</template>

<script>
const prefix = 'v'

export default {
    name: `${prefix}-button`,
    data () {
        return {}
    },
    props: {
        type: String,
        href: String,
        routerTo: String,
        round: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        native: {
            default: '',
            validator: value => {
                console.log(value)
                return ['', 'button', 'submit', 'reset'].indexOf(value) !== -1
            }
        }
    },
     computed: {
        classStyle () {
            return {
                [`${prefix}-btn`]: true,
                'is-round': this.round,
                [`${prefix}-btn-` + this.type]: this.type,
                'is-disabled': this.disabled
            }
        },
        routerHref () {
            if (this.routerTo) {
                let routeData = this.$router.resolve({path: this.routerTo})
                return routeData.href
            } else {
                return this.href
            }
        }
    },
    methods: {
        _handleClick (evt) {
            this.$emit('click', evt)
        }
    }
}
</script>