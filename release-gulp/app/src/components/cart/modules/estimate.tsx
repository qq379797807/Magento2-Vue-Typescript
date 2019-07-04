import Vue, { CreateElement } from 'vue'
import Component from 'vue-class-component'

@Component({
    name: 'v-estimate',
    data: () => ({
        i18n: {
            zip: 'Zip/Postal Code'
        },
        zip: ''
    })
})
export class VEstimate extends Vue {
    public zip: string = ''

    mounted () {
        this.init()
    }

    init () {

    }

    render (h: CreateElement): JSX.Element {
        return (
            <div class="in-estimate">
                <v-form-item label={this.i18n.zip}>
                    <v-input name="zip" v-model={this.zip}></v-input>
                </v-form-item>
            </div>
        )
    }
}