<template>
    <div class="in-page">
        {{ title }}
    </div>
</template>

<script>
export default {
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