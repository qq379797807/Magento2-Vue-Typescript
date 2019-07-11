<template>
    <div class="tab-pane" :class="{'active': tabName === $parent.active}" v-show="tabName === $parent.active">
        <slot v-if="$parent.showContent"></slot>
    </div>
</template>

<script>
const prefix = 'v'

export default {
    name: `${prefix}-tabs-panel`,
    data: () => ({
        tabName: ''
    }),
    props: {
        label: String,
        name: String,
        disabled: Boolean
    },
    created () {
        this.$parent.tabName++
        this.tabName = this.name || 'tab-' + this.$parent.tabName
    },
    mounted () {
        this.$parent.panes.push(this)
    }
}
</script>