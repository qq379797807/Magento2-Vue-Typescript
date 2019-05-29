import Vue, { CreateElement } from 'vue'
import Component from 'vue-class-component'
import AppView from './src/App.vue'

@Component({
    extends: AppView
})
export class App extends Vue {
    render (h: CreateElement): JSX.Element {
        return (
            <AppView />
        )
    }
}