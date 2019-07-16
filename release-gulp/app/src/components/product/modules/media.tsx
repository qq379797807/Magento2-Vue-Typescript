import Vue, { CreateElement } from 'vue'
import Component from 'vue-class-component'

@Component({
    name: 'v-product-media',
    data: () => ({
        i18n: {

        }
    })
})
export class VProductMedia extends Vue {
    mounted () {
        this.init()
    }

    init () {

    }

    render (h: CreateElement): JSX.Element {
        return (
            <div class="in-gallery">
                <v-swiper>
                    <v-swiper-item>000</v-swiper-item>
                    <v-swiper-item>11</v-swiper-item>
                    <v-swiper-item>22</v-swiper-item>
                </v-swiper>
            </div>
        )
    }
}