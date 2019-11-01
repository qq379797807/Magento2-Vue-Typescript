<template>
    <div class="in-method">
        <h2>
            <span class="mark"></span>
            <span v-text="i18n.methodTitle"></span>
        </h2>
        <div class="content">
            <ul class="list" v-if="shippingMethods.length > 0">
                <li v-for="(method, index) in shippingMethods" :key="index">
                    <v-radio name="shipping[method]" v-model="selectShipping" :checked="method.options[0].carrier_code">{{method.carrier_title}}</v-radio>
                </li>
            </ul>
            <p class="no" v-else v-text="i18n.noMethod"></p>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
    name: 'v-method-view',
    data: () => ({
        i18n: {
            methodTitle: 'Shipping Method',
            noMethod: 'There is no available method.'
        },
        selectShipping: ''
    }),
    computed: {
        ...mapState([
            'baseUrl',
            'shippingMethods'
        ])
    },
    mounted () {
        this.init()
    },
    methods: {
        init () {
            
        }   
    }
}
</script>