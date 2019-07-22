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
import Qplus from './module/qplus.vue'
import Modal from './module/modal.vue'
import Table from './table/table.vue'
import TableColumn from './table/column.vue'
import Tabs from './tabs/tabs.vue'
import TabsPanel from './tabs/panel.vue'
import Swiper from './swiper/swiper.vue'
import SwiperItem from './swiper/item.vue'
import Datepicker from './datepicker/datepicker.vue'

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
    Qplus,
    Modal,
    Table,
    TableColumn,
    Tabs,
    TabsPanel,
    Swiper,
    SwiperItem,
    Datepicker
]

const UI: any = {
    install: (Vue: VueConstructor, options?: any) => {
        component.forEach((item: any) => {
            Vue.component(item.name, item)
        })
    }
}

export default UI