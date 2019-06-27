import Vue, { CreateElement } from 'vue'
import Component from 'vue-class-component'
import App from './App.vue'

@Component({
    name: 'v-checkout-view',
    data: () => ({
        title: 'view'
    })
})
export class VCheckoutView extends Vue {
    render (h: CreateElement): JSX.Element {
        return (
            <App />
        )
    }
}