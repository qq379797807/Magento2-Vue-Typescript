import Vue, { CreateElement } from 'vue'
import Component from 'vue-class-component'

const uid = () => {
    return Math.random()
        .toString(36)
        .substring(2)
}

@Component({
    name: 'v-content-loader',
    data: () => ({
        data: {}
    }),
    props: {
        width: {
            type: Number,
            default: 400
        },
        height: {
            type: Number,
            default: 130
        },
        speed: {
            type: Number,
            default: 2
        },
        preserveAspectRatio: {
            type: String,
            default: 'xMidYMid meet'
        },
        baseUrl: {
            type: String,
            default: ''
        },
        primaryColor: {
            type: String,
            default: '#f9f9f9'
        },
        secondaryColor: {
            type: String,
            default: '#ecebeb'
        },
        primaryOpacity: {
            type: Number,
            default: 1
        },
        secondaryOpacity: {
            type: Number,
            default: 1
        },
        uniqueKey: {
            type: String,
            default: ''
        },
        animate: {
            type: Boolean,
            default: true
        }
    }
})
export class VContentLoader extends Vue {
    public data: any
    
    constructor () {
        super()
        this.data = {}
    }

    mounted () {}

    render (h: CreateElement): JSX.Element {
        const idClip = this.uniqueKey ? `${this.uniqueKey}-idClip` : uid()
        const idGradient = this.uniqueKey ? `${this.uniqueKey}-idGradient` : uid()
        
        return (
            <svg
                viewBox={`0 0 ${this.width} ${this.height}`}
                version="1.1"
                preserveAspectRatio={this.preserveAspectRatio}
            >
                <rect
                    style={{ fill: `url(${this.baseUrl}#${idGradient})` }}
                    clip-path={`url(${this.baseUrl}#${idClip})`}
                    x="0"
                    y="0"
                    width={this.width}
                    height={this.height}
                />
                <defs>
                    <clipPath id={idClip}>
                        {this.$slots.default || (
                            <rect
                                x="0"
                                y="0"
                                rx="5"
                                ry="5"
                                width={this.width}
                                height={this.height}
                            />
                        )}
                    </clipPath>
                    <linearGradient id={idGradient}>
                        <stop offset="0%" stop-color={this.primaryColor} stop-opacity={this.primaryOpacity}>
                            {this.animate ? (
                                <animate
                                attributeName="offset"
                                values="-2; 1"
                                dur={`${this.speed}s`}
                                repeatCount="indefinite"
                                />
                            ) : null}
                        </stop>
                        <stop offset="50%" stop-color={this.secondaryColor} stop-opacity={this.secondaryOpacity}>
                            {this.animate ? (
                                <animate
                                attributeName="offset"
                                values="-1.5; 1.5"
                                dur={`${this.speed}s`}
                                repeatCount="indefinite"
                                />
                            ) : null}
                        </stop>
                        <stop offset="100%" stop-color={this.primaryColor} stop-opacity={this.primaryOpacity}>
                            {this.animate ? (
                                <animate
                                attributeName="offset"
                                values="-1; 2"
                                dur={`${this.speed}s`}
                                repeatCount="indefinite"
                                />
                            ) : null}
                        </stop>
                    </linearGradient>
                </defs>
            </svg>
        )
    }
}