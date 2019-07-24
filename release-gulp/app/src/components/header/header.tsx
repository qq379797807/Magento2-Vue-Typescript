import Vue from 'vue'
import Component from 'vue-class-component'
import { VCurrency } from './modules/currency'
import { VLanguage } from './modules/language'
import { VHeaderLinks } from './modules/links'
import { VLogo } from './modules/logo'
import { VMinicart } from './modules/minicart'
import { VSearch } from './modules/search'
import { VNavagition } from '../navagition/navagition'

@Component({
    name: 'v-header',
    data: () => ({
        title: 'header'
    }),
    components: {
        VCurrency,
        VLanguage,
        VHeaderLinks,
        VLogo,
        VMinicart,
        VSearch,
        VNavagition
    }
})
export class VHeader extends Vue {}