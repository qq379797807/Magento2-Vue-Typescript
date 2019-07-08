<template>
    <tbody>
        <template v-for="(row,rowIndex) in data">
            <tr :key="rowIndex" :class="{'warning':$parent.selectedRows.indexOf(row) !== -1, [`parent-tr-${rowIndex+1}`]:isExtend, [row.trClass]:row.trClass}">
                <v-table-id
                    v-for="(column,indexTd) in cols"
                    :column="column"
                    :row="row"
                    :index="rowIndex"
                    :title="$parent.title"
                    :key="indexTd"
                    v-if="column.type!=='extend'">
                </v-table-id>
            </tr>
            <tr :key="'tr' + rowIndex" v-if="isExtend" class="extend" :class="{'warning':$parent.selectedRows.indexOf(row) !== -1, [`extend-tr-${rowIndex+1}`]:true}">
                <v-table-id
                    v-for="(column,indexTd) in cols"
                    :column="column"
                    :row="row"
                    :index="rowIndex"
                    :title="$parent.title"
                    :key="indexTd"
                    v-if="column.type==='extend'"
                    :colspan="colsFilter.length">
                </v-table-id>
            </tr>
        </template>
    </tbody>
</template>

<script>
import VTableTd from './td'

export default {
    name: 'v-table-body',
    props: {
        data: Array
    },
    components: {
        'v-table-id': VTableTd
    },
    computed: {
        cols () {
            return this.$parent.columns
        },
        colsFilter () {
            return this.$parent.columnsFilter
        },
        isExtend () {
            let extend = false
            this.cols.forEach(item => {
                if (item.type === 'extend') {
                    extend = true
                }
            })

            return extend
        }
    }
}
</script>