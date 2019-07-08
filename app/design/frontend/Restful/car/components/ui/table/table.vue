<template>
    <div :class="[prefix + '-table']" :style="{overflow: (width||height)?'auto':'',height:height,width:width}" ref="tableContainer">
        <slot></slot>
        <table
            :class="{'table-stripe':stripe,
            'table-border':border,
            'table-hover':hover,
            'table-ellipsis':ellipsis,
            [className]:className}" ref="table">
            <colgroup>
                <col v-for="(col,index) in colWidth" :width="col" :key="index">
            </colgroup>
            <thead v-if="showHeader" ref="tableHead">
                <tr>
                    <th v-for="(thead,index) in columnsFilter"
                        :class="[thead.fixed,thead.className]"
                        :key="index"
                        :style="{textAlign:thead.align}"
                        :title="title||thead.title?thead.label:null"
                        @mousedown="_headMouseDown($event,index)"
                        @mousemove="_headMouseMove($event,index)">
                        <label @click="_handleSelectAll" :class="[selectChecked,prefix+'-checkbox']"
                                v-if="thead.type==='selection'">
                            <span :class="`${prefix}-checkbox-inner`"></span>
                        </label>
                        <template v-else-if="thead.type==='index'">{{thead.label}}</template>
                        <template v-else>{{thead.label}}
                            <span class="caret-wrapper" v-if="thead.sortBy">
                                <i class="sort-caret asc" @click="sortClick(thead.prop,'asc',$event)"></i>
                                <i class="sort-caret desc" @click="sortClick(thead.prop,'desc',$event)"></i>
                            </span>
                        </template>
                    </th>
                </tr>
            </thead>
            <tbody v-if="data.length===0">
                <tr>
                    <td :colspan="columnsFilter.length" class="empty">{{emptyText}}</td>
                </tr>
            </tbody>
            <v-table-body :data="data" v-else></v-table-body>
        </table>
    </div>
</template>

<script>
const prefix = 'v'
import VTableBody from './body'

export default {
    name: `${prefix}-table`,
    data: () => ({
        prefix: prefix,
        columns: [],
        columnsFilter: [],
        colWidth: [],
        selectChecked: 'un-select',
        selectedRows: [],
        sortBy: {},
        dragHead: {}
    }),
     props: {
        drag: Boolean,
        updateChild: String,
        data: {
        type: Array,
            default: () => {
                return {}
            }
        },
        showHeader: {
            type: Boolean,
            default: true
        },
        className: {
            type: String,
            default: null
        },
        hover: {
            type: Boolean,
            default: true
        },
        border: {
            type: Boolean,
            default: true
        },
        stripe: {
            type: Boolean,
            default: true
        },
        height: String,
        width: String,
        ellipsis: {
            type: Boolean,
            default: true
        },
        emptyText: {
            type: String,
            default: '暂无数据'
        },
        title: {
            type: Boolean,
            default: true
        },
        selectClick: Function,
        sortChange: Function,
        selectAllClick: Function
    },
    components: {
        'v-table-body': VTableBody
    },
    watch: {
        data (oldData, newData) {
            this.clearSelection()
        },
        updateChild () {
            this.$nextTick(() => {
                this.getColumn()
            })
        }
    },
     mounted () {
        this.$nextTick(() => {
        this._fixedHead()
            if (this.drag) {
                this.$refs.tableContainer.style.overflowX = 'auto'
                document.addEventListener('mouseup', this._headMouseUp)
            }
        })
        this.resetColumn()
    },
    methods: {
        _fixedHead () {
            let tableContainer = this.$refs.tableContainer
            tableContainer.addEventListener(
                'scroll',
                this._scrollHandle.bind(this, tableContainer),
                false
            )
            this._fixedRight(tableContainer, 0)
        },
        _scrollHandle (el) {
            const scrollTop = el.scrollTop
            let head = this.$refs.tableHead
            if (scrollTop > 0) {
                head.className = 'transform'
                head.style.transform = `translateY(${scrollTop}px) translateZ(100px)`
                head.style.webkitTransform = `translateY(${scrollTop}px) translateZ(100px)`
            }
            if (scrollTop === 0) {
                head.style = ''
                head.className = ''
            }

            const scrollLeft = el.scrollLeft
            const fixedLeft = el.querySelectorAll('.left')
            if (fixedLeft.length > 0) {
                for (let i = 0, len = fixedLeft.length; i < len; i++) {
                    fixedLeft[i].style.transform = `translateX(${scrollLeft}px) translateZ(90px)`
                    fixedLeft[i].style.webkitTransform = `translateX(${scrollLeft}px) translateZ(90px)`
                }
            }
            this._fixedRight(el, scrollLeft)
        },
        _fixedRight (el, scrollLeft) {
            const fixedRight = el.querySelectorAll('.right')
            const tableWidth = el.querySelector('table').offsetWidth
            let moveMaxWidth = tableWidth - el.clientWidth
            moveMaxWidth = scrollLeft - moveMaxWidth

            if (fixedRight.length > 0) {
                for (let i = 0, len = fixedRight.length; i < len; i++) {
                    fixedRight[i].style.transform = `translateX(${moveMaxWidth}px)translateZ(90px)`
                    fixedRight[i].style.webkitTransform = `translateX(${moveMaxWidth}px)translateZ(90px)`
                }
            }
        },
        _handleSelectAll () {
            if (this.selectChecked === 'checked') {
                this.clearSelection()
            } else {
                this.toggleAllSelection()
            }
            this.selectAllClick && this.selectAllClick(this.selectedRows)
        },
        _selectStatus () {
            if (this.selectedRows.length === this.data.length) {
                this.selectChecked = 'checked'
            } else {
                if (this.selectedRows.length > 0) {
                    this.selectChecked = 'some-select'
                } else {
                    this.selectChecked = 'un-select'
                }
            }
        },
        _headMouseDown (event, index) {
            if (!this.drag) {
                return
            }
            if (event.offsetX > event.target.offsetWidth - 10) {
                this.dragHead = {
                mouseDown: true,
                oldX: event.x,
                oldWidth: event.target.offsetWidth,
                index: index
                }
            }
            event.preventDefault()
        },
        _headMouseMove (event, index) {
            if (!this.drag) {
                return
            }

            if (event.offsetX > event.target.offsetWidth - 10) {
                event.target.style.cursor = 'col-resize'
            } else {
                event.target.style.cursor = 'default'
            }
            if (this.dragHead.mouseDown) {
                let newWidth = this.dragHead.oldWidth + (event.x - this.dragHead.oldX)
                this.$set(this.colWidth, this.dragHead.index, newWidth + 'px')
            }
        },
        _headMouseUp () {
            this.dragHead = {
                mouseDown: false,
                oldX: '',
                oldWidth: '',
                index: ''
            }
        },
        handleChange (row) {
            const index = this.selectedRows.indexOf(row)
            if (index !== -1) {
                this.selectedRows.splice(index, 1)
            } else {
                this.selectedRows.push(row)
            }

            this._selectStatus()
            this.selectClick && this.selectClick(row)
        },
        sortClick (prop, order, e) {
            const parentNode = e.target.parentNode
            parentNode.className = 'caret-wrapper ' + order
            this.sortBy[prop] = order
            this.sortChange && this.sortChange(this.sortBy)
        },
        getSelectAll () {
            return this.selectedRows
        },
        clearSelection () {
            this.selectedRows.splice(0, this.selectedRows.length)
            this.selectChecked = 'un-select'
        },
        toggleAllSelection () {
            this.selectedRows = [...this.data]
            this.selectChecked = 'checked'
        },
        toggleRowSelection (row, selected) {
            const index = this.selectedRows.indexOf(row)
            if (selected === false) {
                if (index !== -1) {
                    this.selectedRows.splice(index, 1)
                }
            } else {
                if (index === -1) {
                    this.selectedRows.push(row)
                }
            }
        },
        clearSort () {
            this.sortBy = {}
        },
        resetColumn () {
            this.$nextTick(() => {
                let child = this.$children
                this.columns = child.filter(item => {
                    return item.$options.componentName === 'Column'
                })

                this.columnsFilter = child.filter(item => {
                    return item.$options.componentName === 'Column' && item.type !== 'extend'
                })
                this.colWidth = []
                    child.forEach(item => {
                    if (item.$options.componentName === 'Column' && item.type !== 'extend') {
                        this.colWidth.push(item.width)
                    }
                })
            })
        }
    },
    destroyed () {
        if (this.drag) {
            document.removeEventListener('onmouseup', this._headMouseUp)
        }
    }
}
</script>