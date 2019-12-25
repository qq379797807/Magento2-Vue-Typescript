import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    name: 'v-props',
    template: `
        <div class="props" v-html="data"></div>
    `,
    props: {
        data: {
            type: String,
            required: true
        }
    }
})
export class VProps extends Vue {}