import Vue, { CreateElement } from 'vue'
import Component from 'vue-class-component'

declare let window: any

@Component({
    name: 'v-product-media',
    data: () => ({
        i18n: {

        }
    })
})
export class VProductMedia extends Vue {
    public grallery: any[] = []

    mounted () {
        this.init()
    }

    init () {
        let productJson: any = window.productJson
        this.grallery = productJson.product_grallery
    }

    render (h: CreateElement): JSX.Element {
        return (
            <div class="in-gallery">
                <v-swiper>
                    {this.grallery.map((item: any, key: number) => {
                        return (
                            <v-swiper-item>
                                {item.type === 'image' ? (
                                    <img src={item.full} title={item.caption} />
                                ) : (
                                    <video src={item.videoUrl}></video>
                                )}
                            </v-swiper-item>
                        )
                    })}
                </v-swiper>
            </div>
        )
    }
}