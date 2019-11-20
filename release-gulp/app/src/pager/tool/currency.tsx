import { VueConstructor } from 'vue'
import { utils, lib } from './utils'

interface CurrencyFilyer {
    name: string,
    symbol?: string,
    thousandsSeparator?: string,
    fractionCount?: number,
    fractionSeparator?: string,
    symbolPosition?: string,
    symbolSpacing?: boolean
}

const VueCurrencyFilter: any = {
    install: (Vue: VueConstructor, options?: CurrencyFilyer) => {
        let defaultConfig: CurrencyFilyer = {
            name: 'currency',
            symbol: '',
            thousandsSeparator: ',',
            fractionCount: 0,
            fractionSeparator: '.',
            symbolPosition: 'front',
            symbolSpacing: false
        }

        let globalConfigs: CurrencyFilyer = utils.__defaults(options, defaultConfig)
        let { name, ...configs } = globalConfigs

        const filterCurrency: Function = (value: any, _symbol: any, _thousandsSeparator: any, _fractionCount: any, _fractionSeparator: any, _symbolPosition: any, _symbolSpacing: any) => {
            let runtimeConfig: any = utils.__defaults({
                symbol: _symbol,
                thousandsSeparator: _thousandsSeparator,
                fractionCount: _fractionCount,
                fractionSeparator: _fractionSeparator,
                symbolPosition: _symbolPosition,
                symbolSpacing: _symbolSpacing
            }, configs)

            if (typeof _symbol === 'object') {
                runtimeConfig = utils.__defaults(_symbol, configs)
            }

            let result: any = 0.0
            const isNegative = String(value).charAt(0) === '-'

            if (isNegative) {
                value = String(value).slice(1)
            }

            const amount = parseFloat(value)
            if (!isNaN(amount)) {
                result = amount
            }

            let formatConfig = '%s%v'
            if (runtimeConfig.symbolPosition === 'front') {
                formatConfig = runtimeConfig.symbolSpacing ? '%s %v' : '%s%v'
            } else {
                formatConfig = runtimeConfig.symbolSpacing ? '%v %s' : '%v%s'
            }

            if (runtimeConfig.fractionCount > 0) {
                value = lib.toFixed(value, runtimeConfig.fractionCount)
            }

            result = lib.formatMoney(value, {
                format: formatConfig,
                symbol: runtimeConfig.symbol,
                precision: runtimeConfig.fractionCount,
                thousand: runtimeConfig.thousandsSeparator,
                decimal: runtimeConfig.fractionSeparator
            })

            if (isNegative) {
                result = '-' + result
            }

            return result
        }

        Vue.filter(name, filterCurrency)
        Vue.prototype.$currencyFilter = {
            setConfig: (options: any) => {
                configs = utils.__defaults(options, defaultConfig)
            },
            getConfig: () => {
                return configs
            }
        }
    }
}

export default VueCurrencyFilter