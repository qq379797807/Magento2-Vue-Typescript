<template>
    <transition name="slide-toggle">
        <div :class="`${prefix}-date-picker clearfix`" v-if="showHide" :style="pickerStyle" @click="_stopPropagation">
            <div class="calendar">
                <div class="calendar-head">
                    <a class="calendar-prev-year" @click="_yearClick(0)">«</a>
                    <a class="calendar-prev-month" @click="_monthClick(0)" v-if="showMonthControl && activePanel!='Year'">‹</a>
                    <a class="calendar-year-select" @click="activePanel='Year'">{{year}}年</a>
                    <a class="calendar-year-month" @click="activePanel='Month'" v-if="showMonth">{{month}}月</a>
                    <a class="calendar-next-month" @click="_monthClick(1)" v-if="showMonthControl && activePanel!='Year'">›</a>
                    <a class="calendar-next-year" @click="_yearClick(1)">»</a>
                </div>
                <div class="calendar-body">
                    <component
                        v-model="activeValue"
                        :is="activePanel"
                        :bodyValue="bodyValue"
                        :type="type"
                        @click="_click">
                    </component>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import Year from './year'
import Month from './month'
import Day from './day'
const prefix = 'v'

export default {
    name: 'datePicker',
    data: () => ({
        prefix: prefix,
        activeValue: '',
        bodyValue: '',
        showHide: true,
        activePanel: ''
    }),
    props: {
        value: [Date, String],
        disabledDate: {
            type: Function,
            default: () => {
                return false
            }
        },
        type: {
            type: String,
            default: 'y',
            validator: (value) => {
                return ['y', 'ym', 'ymd', 'ymdHms'].indexOf(value) !== -1
            }
        },
        offset: Object,
        input: Function,
        innerHTML: Function
    },
    components: {
        Year, 
        Month, 
        Day
    },
     computed: {
        year () {
            return new Date(this.activeValue).getFullYear()
        },
        month () {
            return new Date(this.activeValue).getMonth() + 1
        },
        pickerStyle () {
            if (this.offset) {
                return {
                    left: this.offset.left + 'px',
                    top: this.offset.top + this.offset.height + 'px'
                }
            }
        },
        showMonthControl () {
            return this.type.length > 2
        },
        showMonth () {
            return this.type !== 'y'
        }
    },
    created () {
        this.activeValue = this._getTime(this.value)
        this.bodyValue = this._getTime(this.value)
        this._setActivePanel()
    },
    mounted () {
        document.body.appendChild(this.$el)
    },
    methods: {
        _yearClick (type) {
            let num = 1
            if (this.activePanel === 'Year') {
                num = 10
            }
            if (type === 0) {
                num = -num
            }
            if (this.activePanel === 'Year') {
                this.bodyValue = new Date(this.bodyValue.setYear(this.bodyValue.getFullYear() + num))
            } else {
                this.activeValue = new Date(this.activeValue.setYear(this.activeValue.getFullYear() + num))
            }
        },
        _monthClick (type) {
            let num = 1
            if (type === 0) {
                num = -num
            }
            this.activeValue = new Date(this.activeValue.setMonth(this.activeValue.getMonth() + num))
        },
        _getTime (date) {
            let time
            if (date) {
                time = new Date(date.toString())
                if (time.toString() === 'Invalid Date') {
                    time = new Date()
                }
            } else {
                time = new Date()
            }
            return time
        },
        close () {
            this.showHide = false
        },
        _stopPropagation (e) {
            e.stopPropagation()
        },
        _click (value) {
            if (this.activePanel === 'Year') {
                if (this.type === 'y') {
                    this.input(value)
                    this.close()
                } else {
                    this.activeValue = new Date(this.activeValue.setYear(value))
                    this.activePanel = 'Month'
                }
            } else if (this.activePanel === 'Month') {
                if (this.type === 'ym') {
                    this.input(value)
                    this.close()
                } else {
                    const month = new Date(value).getMonth()
                    this.activeValue = new Date(this.activeValue.setMonth(month))
                    this.activePanel = 'Day'
                }
            } else {
                this.input(value)
                this.close()
            }
        },
        _setActivePanel () {
            if (this.type === 'y') {
                this.activePanel = 'Year'
            } else if (this.type === 'ym') {
                this.activePanel = 'Month'
            } else {
                this.activePanel = 'Day'
            }
        }
    },
    destroyed () {
        this.$el.parentNode.removeChild(this.$el)
    }
}
</script>