import Vue from 'vue'
import Component from 'vue-class-component'

declare let window: any

@Component({
    name: 'v-reviews',
    data: () => ({
        i18n: {
            reviewTitle: 'Write Your Own Review',
            nickname: 'Nickname',
            summary: 'Summary',
            detail: 'Detail',
            submitReview: 'Submit Review',
            signIn: 'Sign in',
            create: 'Create an account'
        },
        nickname: '',
        summary: '',
        detail: '',
        auto: true,
        selectQuality: '',
        selectPrice: '',
        selectValue: '',
        notLogin: ''
    })
})
export class VReviews extends Vue {
    public nickname: string = ''
    public summary: string = ''
    public detail: string = ''
    public selectQuality: string = ''
    public selectPrice: string = ''
    public selectValue: string = ''
    public notLogin: string = ''

    mounted () {
        this.init()
    }

    init () {
        let commonJson = window.commonJson
        this.notLogin = `Only registered users can write reviews. Please <a href="${commonJson.login_url}">${this.i18n.signIn}</a> or <a href="${commonJson.create_url}">${this.i18n.create}</a>`
    }
}