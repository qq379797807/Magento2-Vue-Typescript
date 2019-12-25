import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    name: 'v-description',
    template: `
        <div class="description" v-html="description"></div>
    `,
    props: {
        description: {
            type: String,
            required: true
        }
    }
})
export class VDescription extends Vue {}