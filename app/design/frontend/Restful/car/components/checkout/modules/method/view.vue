<template>
    <div class="in-method">
        <h2>
            <span class="mark"></span>
            <span v-text="i18n.methodTitle"></span>
        </h2>
        <div class="content">
            <p class="no" v-text="i18n.noMethod"></p>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'v-method-view',
    data: () => ({
        i18n: {
            methodTitle: 'Shipping Method',
            noMethod: 'There is no available method.'
        }
    }),
    computed: {
        ...mapState([
            'baseUrl'
        ])
    },
    mounted () {
        console.log(this.baseUrl)
    }
}
</script>