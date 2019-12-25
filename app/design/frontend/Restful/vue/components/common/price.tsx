import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    name: 'v-price',
    template: `
        <span :class="className">{{ price | currency }}</span>
    `,
    props: {
        className: {
            type: String,
            default: ''
        },
        price: {
            type: Number,
            default: 0,
            required: true
        }
    }
})
export class VPrice extends Vue {}