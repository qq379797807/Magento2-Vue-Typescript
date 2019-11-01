<script>
const prefix = 'v'

export default {
    name: `${prefix}-tabs`,
    props: {
        value: {
            type: String,
            default: 'tab-1'
        },
        change: Function,
        showContent: {
            type: Boolean,
            default: true
        }
    },
    data: () => ({
        panes: [],
        active: '',
        tabName: 0
    }),
    mounted () {
        this.active = this.value
    },
    methods: {
        _onTabClick (item, index) {
            if (!item.disabled) {
                this.active = item.tabName
                this.$emit('input', item.tabName)
                this.change && this.change(item.tabName, item.label, index + 1)
            }
        }
    },
    render () {
        return (
            <div class={`${prefix}-tabs`}>
                <div class="tabs-nav">
                    {this.panes.map((pane, index) => {
                        return (
                            <div class={{
                                'tabs-tab': true,
                                'active': this.active === pane.tabName,
                                'disabled': pane.disabled
                            }}
                            on-click={(ev) => {
                                this._onTabClick(pane, index, ev)
                            }}>
                                {pane.$slots.label || pane.label}
                            </div>
                        )
                    })}
                </div>
                {this.$slots.content}
                <div class="tabs-content" style={{'display': this.showContent ? null : 'none'}}>
                    {this.$slots.default}
                </div>
            </div>
        )
    }
}
</script>