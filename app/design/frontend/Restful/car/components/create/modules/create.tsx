import Vue from 'vue'
import Component from 'vue-class-component'

declare let window: any

@Component({
    name: 'v-create',
    data: () => ({
        i18n: {
            email: 'Email',
            password: 'Password',
            comfirm: 'Confirm Password',
            street: 'Street Address',
            city: 'City',
            country: 'Country',
            state: 'State/Province',
            zip: 'Zip',
            button: 'Create an Account'
        },
        showEye: true,
        showRegion: false,
        counter: [],
        email: '',
        password: '',
        comfirm: '',
        street: [],
        city: '',
        postcode: '',
        country: [],
        region: [],
        selectCountry: '',
        selectRegion: '',
        address_count: 0
    })
})
export class VCreate extends Vue {
    public showRegion: boolean = false
    public counter: number[] = []
    public email: string = ''
    public password: string = ''
    public comfirm: string = ''
    public street: string[] = []
    public city: string = ''
    public postcode: string = ''
    public country: any[] = []
    public region: any[] = []
    public selectCountry: string = ''
    public selectRegion: string = ''
    public address_count: number = 0

    mounted () {
        this.init()
    }

    init () {
        let registerJson: any = window.registerJson
        this.country = registerJson.country
        this.address_count = registerJson.address_count - 1
        this.counter = Array.apply(null, Array(this.address_count)).map((item, i) => {
            return i
        })
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
}