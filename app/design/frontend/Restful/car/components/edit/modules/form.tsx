import Vue from 'vue'
import Component from 'vue-class-component'

declare let window: any

@Component({
    name: 'v-account-edit',
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
            currentPassword: 'Current Password',
            taxvat: 'Tax/VAT number',
            gender: 'Gender',
            save: 'Save',
            changeEmail: 'Change Email',
            changePassword: 'Change Password'
        }
    })
})
export class VAccountEdit extends Vue {
    public showEye: boolean = true
    public showRegion: boolean = false
    public prefixEnabled: boolean = false
    public prefixOption: any[] = []
    public suffixEnabled: boolean = false
    public suffixOption: any[] = []
    public firstname: string = ''
    public middlename: string = ''
    public lastname: string = ''
    public email: string = ''
    public password: string = ''
    public comfirm: string = ''
    public taxVat: string = ''
    public dob: string = ''
    public selectPrefix: string = ''
    public selectSuffix: string = ''
    public genderOption: any[] = []
    public selectGender: string = ''
    public changeEmail: boolean = true
    public changePassword: boolean = false
    public currentPassword: string = ''

    mounted () {
        this.init()
    }

    init () {
        let commonJson: any = window.commonJson
        let registerJson: any = window.registerJson
        this.prefixEnabled = registerJson.prefix.enabled
        this.prefixOption = this.changeOption(registerJson.prefix.options)
        this.suffixEnabled = registerJson.suffix.enabled
        this.suffixOption = this.changeOption(registerJson.suffix.options)
        this.genderOption = this.filterGender(registerJson.gender.options)
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