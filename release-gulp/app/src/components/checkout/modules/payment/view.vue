<template>
    <div class="in-payment">
        <h2>
            <span class="mark"></span>
            <span v-text="i18n.paymentTitle"></span>
        </h2>
        <div class="content">
            <v-form>
                <v-form-item>
                    <v-checkbox v-model="sameAs">
                        <span v-text="i18n.sameAs"></span>
                    </v-checkbox>
                </v-form-item>
                <template v-if="!sameAs">
                    <v-form-item :label="i18n.firstName">
                        <v-input name="firstname" v-model="first_name"></v-input>
                    </v-form-item>
                    <v-form-item :label="i18n.lastName">
                        <v-input name="lastname" v-model="last_name"></v-input>
                    </v-form-item>
                    <v-form-item class="v-country" :label="i18n.country">
                        <v-select name="country_id" :placeholder="i18n.chooseCountry" :options="country" v-model="selectCountry" :filterable="filterable" :icon="icon" :number="number" @change="changeRegion"></v-select>
                    </v-form-item>
                    <v-form-item :label="i18n.state">
                        <v-input name="region" v-if="!showRegion" v-model="selectRegion"></v-input>
                        <v-select name="region_id" v-if="showRegion" :placeholder="i18n.chooseRegion" :options="region" v-model="selectRegion" :filterable="filterable" :number="number"></v-select>
                    </v-form-item>
                    <v-form-item :label="i18n.city">
                        <v-input name="city" v-model="city"></v-input>
                    </v-form-item>
                     <v-form-item :label="i18n.street">
                        <v-input name="street[0]" v-model="street"></v-input>
                    </v-form-item>
                    <v-form-item :label="i18n.company">
                        <v-input name="company" v-model="company"></v-input>
                    </v-form-item>
                    <v-form-item :label="i18n.zip">
                        <v-input name="postcode" v-model="zip"></v-input>
                    </v-form-item>
                    <v-form-item :label="i18n.phone">
                        <v-input name="telephone" v-model="phone"></v-input>
                    </v-form-item>
                    <v-form-item>
                        <v-checkbox v-model="saveBook">
                            <span v-text="i18n.saveBook"></span>
                        </v-checkbox>
                    </v-form-item>
                </template>
            </v-form>
            <ul class="list" v-if="paymentMethods.length > 0">
                <li v-for="(method, index) in paymentMethods" :key="index">
                    <v-radio name="payment[method]" v-model="selectPayment" :checked="method.value">{{method.label}}</v-radio>
                </li>
            </ul>
            <p class="no" v-else v-text="i18n.noMethod"></p>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
    name: 'v-payment-view',
    data: () => ({
        i18n: {
            paymentTitle: 'Payment Method',
            sameAs: 'My billing and shipping address are the same',
            firstName: 'First Name',
            lastName: 'Last Name',
            street: 'Street Address',
            city: 'City',
            country: 'Country',
            state: 'State/Province',
            zip: 'Zip/Postal Code',
            company: 'Company',
            phone: 'Phone Number',
            chooseCountry: 'Choose Country',
            chooseRegion: 'Choose Region',
            noMethod: 'There is no available payment.',
            saveBook: 'Save in address book'
        },
        filterable: true,
        icon: true,
        number: 8,
        sameAs: true,
        first_name: '',
        last_name: '',
        street: '',
        city: '',
        country: [],
        region: [],
        zip: '',
        company: '',
        phone: '',
        saveBook: false,
        selectCountry: '',
        selectRegion: '',
        showRegion: false,
        selectPayment: ''
    }),
    computed: {
        ...mapState([
            'countries',
            'paymentMethods'
        ])
    },
    mounted () {
        this.init()
    },
    methods: {
        init () {
            let checkoutJson = window.checkoutJson
            this.country = this.countries
            this.selectCountry = (checkoutJson.defaultCountryId).toLowerCase()
        },
        changeRegion (value, name) {
            for (let item of this.country) {
                if (item.value === value) {
                    if (item.regions.length > 0) {
                        this.region = item.regions
                        this.showRegion = true
                    } else {
                        this.region = []
                        this.selectRegion = ''
                        this.showRegion = false
                    }
                }
            }
        }
    }     
}
</script>