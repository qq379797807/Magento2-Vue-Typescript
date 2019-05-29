<template>
    <div id="app">
        {{ title }}
    </div>
</template>

<script>
export default {
    name: 'app',
    data: () => ({
        title: 'Magento2 PWA'
    }),
    mounted () {
        this.init()
    },
    methods: {
        init () {
            console.log(`Magento2 App is bootstrap ...`)
        }   
    }
}
</script>