<script>
const prefix = 'v'

export default {
    name: `${prefix}-table-column`,
    componentName: `${prefix}-table-column`,
    data: () => ({
        renderCell: {}
    }),
    props: {
        prop: String,
        label: String,
        width: String,
        className: {
            type: String,
            default: ''
        },
        align: {
            validator: (value) => {
                return ['left', 'center', 'right'].indexOf(value) !== -1
            }
        },
        type: {
            validator: (value) => {
                return ['selection', 'index', 'extend', 'cart'].indexOf(value) !== -1
            }
        },
        fixed: {
            validator: (value) => {
                return ['left', 'right'].indexOf(value) !== -1
            }
        },
        sortBy: {
            type: Boolean,
            default: false
        },
        title: {
            type: Boolean,
            default: false
        }
    },
    created () {
        this.renderCell = (h, {row, column, $index}) => {
            if (this.$scopedSlots.default) {
                const data = {row: row, index: $index + 1}
                return this.$scopedSlots.default(data)
            }

            if (column.type === 'selection') {
                let className = `${prefix}-checkbox`
                if (this.$parent.selectedRows.indexOf(row) !== -1) {
                    className += ' checked'
                }

                return h('label', {
                    attrs: {class: className},
                    on: {
                        click: this._handleChange.bind(this, row)
                    }
                }, [
                    h('span', {class: `${prefix}-checkbox-inner`})
                ])
            }
            if (column.type === 'index') {
                return $index + 1
            }
            
            return row[column.prop]
        }
    },
    methods: {
        _handleChange (row) {
            this.$parent.handleChange(row)
        }
    },
    render (h) {
        return null
    }
}
</script>