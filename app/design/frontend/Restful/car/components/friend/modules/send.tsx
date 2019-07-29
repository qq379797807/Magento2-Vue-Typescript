import Vue from 'vue'
import Component from 'vue-class-component'

declare let window: any

@Component({
    name: 'v-send-firend',
    data: () => ({
        i18n: {
            sender: 'Sender',
            name: 'Name',
            email: 'Email',
            message: 'Message',
            invitee: 'Invitee',
            addInvitee: 'Add Invitee',
            removeInvite: 'Remove Invitee',
            sendEmail: 'Send Email',
            cancel: 'Cancel'
        }
    })
})
export class VSendFirend extends Vue {
    public name: string = ''
    public email: string = ''
    public message: string = ''
    public auto: boolean = true
    public maxRows: number = 0
    public action: string = ''
    public items: any[] = ['']
    public recipientsName: any[] = []
    public recipientsEmail: any[] = []

    mounted () {
        this.init()
    }

    init () {
        let friendJson: any = window.friendJson
        this.maxRows = friendJson.max_rows
        this.action = friendJson.send_url
        this.name = friendJson.user_name
        this.email = friendJson.email
        this.message = friendJson.message
    }

    _addInvitee () {
        const len: number = this.items.length

        if (len < this.maxRows) {
            this.items.push('')
        } else {
            return false
        }
    }

    _removeInvitee (index: number) {
        const len: number = this.items.length

        if (len > 1) {
            this.items.splice(index, 1)
            this.$delete(this.recipientsName, index)
            this.$delete(this.recipientsEmail, index)
        } else {
            return false
        }
    }

    _cancel (): void {
        window.history.go(-1)
    }
}