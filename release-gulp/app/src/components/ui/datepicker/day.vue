<template>
	<div class="calendar-days">
		<div class="calendar-week">
			<span v-for="item in dateData" v-text="item"></span>
		</div>
		<div class="calendar-list">
			<a href="javacript:;" v-for="(item, index) in days" :class="[_dayClass(item)]" @click="_selectDay(item, $event)" :key="index">{{item.d}}
				<span v-text="_innerHTML(item)" v-if="_innerHTML(item)"></span>
			</a>
		</div>
		<div class="calendar-time" v-if="type==='ymdHms'">
			<div class="calendar-time-input">
				<input type="text" v-model="hours" maxlength="2" oninput="value=value.replace(/[^\d]/g,'')" />:
				<input type="text" v-model="minutes" maxlength="2" oninput="value=value.replace(/[^\d]/g,'')" />:
				<input type="text" v-model="seconds" maxlength="2" oninput="value=value.replace(/[^\d]/g,'')" />
			</div>
			<a class="btn-time" @click="_selectConfirm" v-text="i18n.comfirm"></a>
		</div>
	</div>
</template>

<script>
export default {
	name: 'day',
	data: () => ({
		i18n: {
			comfirm: 'Comfirm'
		},
		selectValue: null,
		hours: null,
		minutes: null,
		seconds: null,
		dateData: [
			'Su',
			'Mo',
			'Tu',
			'We',
			'Th',
			'Fr',
			'Sa'
		]
	}),
	props: {
		value: {
			type: Date,
			default: null
		},
		bodyValue: {
			type: Date,
			default: null
		},
		type: String
	},
	computed: {
		days () {
			let days = []
			const year = this.value.getFullYear()
			const month = this.value.getMonth()
			const time = new Date(year, month, 1)
			time.setDate(0)
			let lastDay = time.getDate()
			const week = time.getDay()
			let count = week + 1
			while (count > 0) {
				days.push({
					d: lastDay - count + 1,
					y: month > 0 ? year : year - 1,
					m: month > 0 ? month - 1 : 11,
					p: true
				})
				count--
			}
			time.setMonth(time.getMonth() + 2, 0)
			lastDay = time.getDate()
			for (let i = 1; i <= lastDay; i++) {
					days.push({
					d: i,
					y: year,
					m: month
				})
			}
			for (let i = 1; days.length < 42; i++) {
				days.push({
					d: i,
					y: month < 11 ? year : year + 1,
					m: month < 11 ? month + 1 : 0,
					n: true
				})
			}
			return days
		}
	},
	mounted () {
		this.selectValue = this.bodyValue,
		this.hours = this.value.getHours(),
		this.minutes = this.value.getMinutes(),
		this.seconds = this.value.getSeconds()
	},
	methods: {
		_dayClass (item) {
			let time = new Date(item.y, item.m, item.d)
			let selectTimer = this.selectValue == null ? this.selectValue : this.selectValue.toDateString()
			
			return {
				'calendar-date-out': item.p || item.n,
				'calendar-date-today': time.toDateString() === new Date().toDateString(), 
				'calendar-date-select': time.toDateString() === selectTimer,
				'calendar-date-disabled': this.$parent.disabledDate(time)
			}
		},
		_selectDay (item, e) {
			let disabled = e.target.className
			if (disabled.indexOf('calendar-date-disabled') === -1) {
				const date = new Date(item.y, item.m, item.d)

				if (this.type === 'ymdHms') {
					this.selectValue = date
				} else {
					this.$emit('click', date.toDateString())
				}
			}
		},
		_selectConfirm () {
			this.hours = this.hours > 23 ? 23 : this.hours
			this.minutes = this.minutes > 59 ? 59 : this.minutes
			this.seconds = this.seconds > 59 ? 59 : this.seconds
			this.selectValue.setHours(this.hours)
			this.selectValue.setMinutes(this.minutes)
			this.selectValue.setSeconds(this.seconds)
			this.$emit('click', this.selectValue)
		},
		_innerHTML (item) {
			let time = new Date(item.y, item.m, item.d)
			return this.$parent.innerHTML && this.$parent.innerHTML(time)
		}
	}
}
</script>