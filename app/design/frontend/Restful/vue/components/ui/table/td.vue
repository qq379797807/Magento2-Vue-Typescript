<script>
export default {
    name: 'v-table-id',
    props: ['column', 'row', 'index', 'title'],
    render (h) {
        const row = this.row
        const column = this.column
        const $index = this.index
        const title = this.title
        let classNameTd = column.fixed

        if (column.className && column.fixed) {
            classNameTd += ' ' + column.className
        } else if (column.className) {
            classNameTd = column.className
        }

        return (
            <td class={classNameTd} style={'text-align:' + column.align} title={title || column.title ? row[column.prop] : null}>
                {
                    this.column.renderCell.call(this, h, {
                    row,
                    column,
                    $index
                    })
                }
            </td>
        )
    }
}
</script>