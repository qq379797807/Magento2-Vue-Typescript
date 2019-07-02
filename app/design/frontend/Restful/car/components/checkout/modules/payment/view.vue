<template>
    <div class="in-payment">
        <h2>
            <span class="mark"></span>
            <span v-text="i18n.paymentTitle"></span>
        </h2>
        <div class="content">
            <v-form>
                <v-form-item>
                    <v-checkbox v-model="sameAs">{{i18n.sameAs}}</v-checkbox>
                </v-form-item>
                <template v-if="!sameAs">
                    <v-form-item :label="i18n.firstName">
                        <v-input v-model="first_name"></v-input>
                    </v-form-item>
                    <v-form-item :label="i18n.lastName">
                        <v-input v-model="last_name"></v-input>
                    </v-form-item>
                    <v-form-item :label="i18n.street">
                        <v-input v-model="street"></v-input>
                    </v-form-item>
                    <v-form-item :label="i18n.city">
                        <v-input v-model="city"></v-input>
                    </v-form-item>
                    <v-form-item :label="i18n.zip">
                        <v-input v-model="zip"></v-input>
                    </v-form-item>
                    <v-form-item :label="i18n.company">
                        <v-input v-model="company"></v-input>
                    </v-form-item>
                    <v-form-item :label="i18n.phone">
                        <v-input v-model="phone"></v-input>
                    </v-form-item>
                </template>
            </v-form>
        </div>
    </div>
</template>

<script>
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
            phone: 'Phone Number'
        },
        sameAs: true,
        first_name: null,
        last_name: null,
        street: null,
        city: null,
        country: null,
        zip: null,
        company: null,
        phone: null
    })    
}
</script>