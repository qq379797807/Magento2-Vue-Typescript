import { VueConstructor } from 'vue'
import Input from './element/input.vue'
import Checkbox from './element/checkbox.vue'
import Radio from './element/radio.vue'
import Textarea from './element/textarea.vue'
import Form from './element/form.vue'
import FormItem from './element/formItem.vue'
import Button from './element/button.vue'
import Select from './element/select.vue'
import Collapse from './module/collapse.vue'
import CollapsePanel from './module/panel.vue'
import Table from './table/table.vue'
import TableColumn from './table/column.vue'

const component: any[] = [
    Input,
    Checkbox,
    Radio,
    Textarea,
    Form,
    FormItem,
    Button,
    Select,
    Collapse,
    CollapsePanel,
    Table,
    TableColumn
]

const UI: any = {
    install: (Vue: VueConstructor, options?: any) => {
        component.forEach((item: any) => {
            Vue.component(item.name, item)
        })
    }
}

export default UI