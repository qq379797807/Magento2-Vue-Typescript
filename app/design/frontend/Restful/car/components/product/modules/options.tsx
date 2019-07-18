import Vue, { CreateElement } from 'vue'
import Component from 'vue-class-component'

declare let window: any

@Component({
    name: 'v-product-options',
    data: () => ({
        title: 'options'
    })
})
export class VProductOptions extends Vue {
    public attributes: any = {}

    mounted () {
        this.init()
    }

    init () {
        let productJson: any = window.productJson
        this.attributes = productJson.configurable.attributes
    }

    chooseOption (code: any, option: any) {
        console.log(code, option)
    }

    render (h: CreateElement): JSX.Element {
        return (
            <div class="v-options">
                {Object.keys(this.attributes).map((key: any) => {
                    const item: any = this.attributes[key]
                    return (
                        <v-form-item class={`v-${item.code}`} label={item.label}>
                            {item.options.map((option: any) => {
                                return (
                                    <a href="javascript:;" class="v-attr" title={option.label} onClick={() => {
                                        this.chooseOption(item.code, option)
                                    }}>
                                        {item.code === 'color' ? (
                                            <span style={`background-color:${option.value}`}></span>
                                        ) : (
                                            <span>{option.label}</span>
                                        )}
                                    </a>
                                )
                            })}
                        </v-form-item>
                    )
                })}
            </div>
        )
    }
}