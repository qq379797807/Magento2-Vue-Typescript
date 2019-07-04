import Vue from 'vue'
import Component from 'vue-class-component'

declare let window: any

@Component({
    name: 'v-create',
    data: () => ({
        i18n: {
            prefix: 'Name Prefix',
            suffix: 'Name Suffix',
            firstname: 'First Name',
            middlename: 'Middle Name/Initial',
            lastname: 'Last Name',
            email: 'Email',
            password: 'Password',
            comfirm: 'Confirm Password',
            street: 'Street Address',
            city: 'City',
            country: 'Country',
            state: 'State/Province',
            zip: 'Zip',
            subscribed: 'Sign Up for Newsletter',
            button: 'Create an Account',
            telephone: 'Phone Number',
            company: 'Company',
            fax: 'Fax',
            taxvat: 'Tax/VAT number',
            gender: 'Gender'
        },
        showEye: true,
        showRegion: false,
        prefixEnabled: false,
        prefixOption: [],
        suffixEnabled: false,
        suffixOption: [],
        counter: [],
        firstname: '',
        middlename: '',
        lastname: '',
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
        address_count: 0,
        subscribed: false,
        telephone: '',
        company: '',
        fax: '',
        taxVat: '',
        dob: '',
        selectPrefix: '',
        selectSuffix: '',
        genderOption: [],
        selectGender: ''
    })
})
export class VCreate extends Vue {
    public showRegion: boolean = false
    public prefixEnabled: boolean = false
    public prefixOption: any[] = []
    public suffixEnabled: boolean = false
    public suffixOption: any[] = []
    public counter: number[] = []
    public firstname: string = ''
    public middlename: string = ''
    public lastname: string = ''
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
    public subscribed: boolean = false
    public telephone: string = ''
    public company: string = ''
    public fax: string = ''
    public taxVat: string = ''
    public dob: string = ''
    public selectPrefix: string = ''
    public selectSuffix: string = ''
    public genderOption: any[] = []
    public selectGender: string = ''

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
        this.prefixEnabled = registerJson.prefix.enabled
        this.prefixOption = this.changeOption(registerJson.prefix.options)
        this.suffixEnabled = registerJson.suffix.enabled
        this.suffixOption = this.changeOption(registerJson.suffix.options)
        this.genderOption = this.filterGender(registerJson.gender.options)
    }

    changeRegion (value: string, name: string): void {
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

    filterGender (options: any[]): any[] {
        let result: any[] = []

        for (let item of options) {
            if (!this.isNull(item.name)) {
                result.push(item)
            }
        }

        return result
    }

    changeOption (options: any): any[] {
        let result: any[] = []

        Object.keys(options).forEach((key: any) => {
            if (!this.isNull(key)) {
                result.push({
                    'name': key,
                    'value': options[key]
                })
            }
        })

        return result
    }

    isNull (param: string): boolean {
        const regExp = new RegExp('^[ ]+$')

        if (param === '') {
          return true
        }
        return regExp.test(param)
    }
}