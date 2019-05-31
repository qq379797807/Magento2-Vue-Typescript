import Vue, { CreateElement } from 'vue'
import Component from 'vue-class-component'

@Component({
    name: 'page',
    data: () => ({
        logoUrl: 'www.baidu.com'
    }),
    mounted () {
        this.init()
    },
    methods: {
        init () {
            console.log(`Magento2 App is bootstrap ...`)
        }   
    }
})
export class App extends Vue {
    render (h: CreateElement): JSX.Element {
        return (
            <div class="app" />
        )
    }
}