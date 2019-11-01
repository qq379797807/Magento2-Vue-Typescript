import Vue, { CreateElement } from 'vue'
import Component from 'vue-class-component'

declare let window: any

@Component({
    name: 'v-estimate',
    data: () => ({
        i18n: {
            country: 'Country',
            chooseCountry: 'Choose Country',
            state: 'State/Province',
            chooseRegion: 'Choose Region',
            zip: 'Zip/Postal Code'
        },
        country: [],
        selectCountry: '',
        region: [],
        selectRegion: '',
        zip: '',
        filterable: true,
        icon: true,
        number: 4,
        showRegion: false
    })
})
export class VEstimate extends Vue {
    public country: any[] = []
    public selectCountry: string = ''
    public region: any[] = []
    public selectRegion: string = ''
    public zip: string = ''
    public filterable: boolean = true
    public icon: boolean = true
    public number: number = 4
    public showRegion: boolean = false

    mounted () {
        this.init()
    }

    init () {
        let cartJson: any = window.cartJson
        this.country = cartJson.country
        this.selectCountry = (cartJson.defaultCountryId).toLowerCase()
    }

    changeRegion (value: string, name: string) {
        for (let item of this.country) {
            if (item.value === value) {
                if (item.regions.length > 0) {
                    this.region = item.regions
                    this.showRegion = true
                } else {
                    this.region = []
                    this.selectRegion = ''
                    this.showRegion = false
                }
            }
        }
    }

    render (h: CreateElement): JSX.Element {
        return (
            <div class="in-estimate">
                <v-form-item class="v-country" label={this.i18n.country}>
                    <v-select name="country_id" placeholder={this.i18n.chooseCountry} options={this.country} vModel={this.selectCountry} filterable={this.filterable} icon={this.icon} number={this.number} onChange={(value: string, name: string) => this.changeRegion(value, name)}></v-select>
                </v-form-item>
                <v-form-item label={this.i18n.state}>
                    {this.showRegion ? (
                       <v-select name="region_id" placeholder={this.i18n.chooseRegion} options={this.region} vModel={this.selectRegion} filterable={this.filterable} number={this.number}></v-select>
                    ) : (
                        <v-input name="region" vModel={this.selectRegion}></v-input> 
                    )}
                </v-form-item>
                <v-form-item label={this.i18n.zip}>
                    <v-input name="zip" vModel={this.zip}></v-input>
                </v-form-item>
            </div>
        )
    }
}