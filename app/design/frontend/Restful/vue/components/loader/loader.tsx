import Vue, { CreateElement } from 'vue'
import Component from 'vue-class-component'
import svgLoading from './loading.svg'

@Component({
    name: 'v-loading',
    data: () => ({
        data: {}
    }),
    props: {
        color: {
            type: String,
            required: false,
            default: '#5ac1dd'
        },
        size: {
            type: Object,
            required: false,
            default: {
                width: '45px',
                height: '45px'
            }
        }
    }
})
export class VLoading extends Vue {
    constructor () {
        super()
    }

    private get svg () {
        return svgLoading
    }

    private get loadingStyle () {
        return {
            fill: this.color,
            width: this.size.width,
            height: this.size.height
        }
    }

    render (h: CreateElement): JSX.Element {
        return (
            <div class="v-loading"
                style={this.loadingStyle}
                domPropsInnerHTML={this.svg}>
            </div>
        )
    }
}