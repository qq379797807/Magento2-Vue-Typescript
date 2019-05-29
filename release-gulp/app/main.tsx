import Vue, { CreateElement } from 'vue'
import { App } from './App'

new Vue({
    el: '#app',
    render: (h: CreateElement) => {
        return <App />
    }
})