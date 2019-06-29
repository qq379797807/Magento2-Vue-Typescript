import { VueConstructor } from 'vue'
import Input from './element/input.vue'
import Checkbox from './element/checkbox.vue'

const component: any[] = [
    Input,
    Checkbox
]

const UI: any = {
    install: (Vue: VueConstructor, options?: any) => {
        component.forEach((item: any) => {
            Vue.component(item.name, item)
        })
    }
}

export default UI