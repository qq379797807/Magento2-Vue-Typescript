import Vue, { CreateElement } from 'vue'
import Component from 'vue-class-component'
import View from './src/View.vue'

@Component({
    name: 'page'
})
export class App extends Vue {
    render (h: CreateElement): JSX.Element {
        return (
            <View />
        )
    }
}