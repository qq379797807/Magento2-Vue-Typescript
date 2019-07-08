import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    name: 'v-shipping',
    data: () => ({
        title: 'shipping',
        tableData: []
    })
})
export class VShipping extends Vue {
    public tableData: any[] = [
        {
            date: '2016-05-03',
            name: '1王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200330,
            trClass: 'trClass'
          },
          {
            date: '2016-05-02',
            name: '2王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200331
          },
          {
            date: '2016-05-04',
            name: '3王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200332
          }
    ]

    mounted () {
        this.init()
    }

    init () {

    }
}