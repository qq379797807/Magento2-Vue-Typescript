import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    name: 'app',
    data: () => ({
        logoUrl: 'https://www.baidu.com'
    })
})
export class App extends Vue {
    mounted () {
        this.init()
    }

    init () {
        console.log(`Magento2 App is bootstrap ...`)
    }   
}