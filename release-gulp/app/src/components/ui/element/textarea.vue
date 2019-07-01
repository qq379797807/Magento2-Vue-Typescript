<template>
  <textarea :class="`${prefix}-textarea`" ref="text" :style="style" @input="_change" v-model="textValue"></textarea>
</template>

<script>
const prefix = 'v'

export default {
    name: `${prefix}-textarea`,
    data: () => ({
        textValue: '',
        border: 2
    }),
    props: {
        value: String,
        autoHeight: {
            type: Boolean,
            default: true
        },
        width: {
            type: String,
            default: '100%'
        },
        height: {
            type: String,
            default: '80px'
        }
    },
    computed: {
        style () {
            return {
                width: this.width,
                height: this.height,
                minHeight: this.height,
                overflow: this.autoHeight ? 'hidden' : '',
                boxSizing: 'border-box'
            }
        }
    },
    watch: {
        textValue (v) {
            this.$emit('input', v)
            if (this.autoHeight) {
                let el = this.$refs.text
                el.style.height = 'auto'
                el.style.height = (el.scrollHeight + this.border) + 'px'
            }
        }
    },
    mounted () {
        this._getBorder()
    },
    methods: {
        _getBorder () {
            let el = this.$refs.text
            this.border = el.offsetHeight - el.clientHeight
        },
        _change (e) {
            this.$emit('input', e.target.value)
        }
    }
}
</script>