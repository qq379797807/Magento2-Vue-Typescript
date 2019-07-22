<template>
    <div class="calendar-year">
        <a href="javacript:;" v-for="(item,index) in yearList" :class="[_getClass(item)]" @click="_selectYear(item,$event)" :key="index" v-text="item"></a>
    </div>
</template>

<script>
export default {
    name: 'year',
    data: () => ({

    }),
    props: {
        value: {
			type: Date,
			default: null
		},
		bodyValue: {
			type: Date,
			default: null
		}
    },
    computed: {
        yearList () {
            let array = []
            const year = this.bodyValue.getFullYear()
            for (let i = year - 4; i <= year + 7; i++) {
                array.push(i)
            }
            return array
        }
    },
    methods: {
        _selectYear (item, e) {
            let disabled = e.target.className
            if (disabled.indexOf('calendar-date-disabled') === -1) {
                this.$emit('click', item.toString())
            }
        },
        _getClass (item) {
            let time = new Date(item.toString())
            return {
                'calendar-date-select': item === this.value.getFullYear(),
                'calendar-date-disabled': this.$parent.disabledDate(time)
            }
        }
    }
}
</script>