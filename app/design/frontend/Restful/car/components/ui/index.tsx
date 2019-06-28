import { VueConstructor } from 'vue'
import Input from './element/input.vue'

const component: any[] = [
    Input
]

const UI: any = {
    install: (Vue: VueConstructor, options?: any) => {
        component.forEach((item: any) => {
            Vue.component(item.name, item)
        })
    }
}

export default UI