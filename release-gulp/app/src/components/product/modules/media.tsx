import Vue, { CreateElement } from 'vue'
import { mapGetters } from 'vuex'
import Component from 'vue-class-component'

@Component({
    name: 'v-product-media',
    data: () => ({
        i18n: {
            media: 'media'
        }
    }),
    computed: {
        ...mapGetters([
            'grallery'
        ])
    }
})
export class VProductMedia extends Vue {
    mounted () {

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