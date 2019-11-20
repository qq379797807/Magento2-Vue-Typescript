const utils: any = {
    __isNull (obj: any) {
        return typeof obj === 'undefined' || obj === null
    },
    __isString (obj: any) {
        return !!(obj === '' || (obj && obj.charCodeAt && obj.substr))
    },
    __isArray (obj: any) {
        return Array.isArray ? Array.isArray(obj) : toString.call(obj) === '[object Array]'
    },
    __isObject (obj: any) {
        return obj && toString.call(obj) === '[object Object]'
    },
    __defaults (obj: any, defs: any) {
        let key
        obj = obj || {}
        defs = defs || {}
        
        for (key in defs) {
          if (defs.hasOwnProperty(key)) {
            if (obj[key] == null) obj[key] = defs[key]
          }
        }
        return obj
    },
    __map (obj: any, iterator: any, context: any) {
        let results: any[] = []
        let i, j
    
        if (!obj) return results
    
        if (Array.prototype.map && obj.map === Array.prototype.map) return obj.map(iterator, context)
    
        for (i = 0, j = obj.length; i < j; i++) {
          results[i] = iterator.call(context, obj[i], i, obj)
        }

        return results
    }
}

const lib: any = {
    settings: {
        currency: {
            symbol: '$',
            format: '%s%v',
            decimal: '.',
            thousand: ',',
            precision: 2, 
            grouping: 3
        },
        number: {
            precision: 0, 
            grouping: 3,
            thousand: ',',
            decimal: '.'
        }
    },
    checkPrecision (val: any, base: any) {
        val = Math.round(Math.abs(val))
    
        return isNaN(val) ? base : val
    },
    checkCurrencyFormat (format: any) {
        const defaults = lib.settings.currency.format
    
        if (typeof format === 'function') format = format()
    
        if (utils.__isString(format) && format.match('%v')) {
            return {
                pos: format,
                neg: format.replace('-', '').replace('%v', '-%v'),
                zero: format
            }
        } else if (!format || !format.pos || !format.pos.match('%v')) {
            return (!utils.__isString(defaults)) ? defaults : lib.settings.currency.format = {
                pos: defaults,
                neg: defaults.replace('%v', '-%v'),
                zero: defaults
            }
        }
    
        return format
    },
    unformat (value: any, decimal: any) {
        if (utils.__isArray(value)) {
            return utils.__map(value, (val: any) => {
                return this.unformat(val, decimal)
            })
        }
    
        value = value || 0
    
        if (typeof value === 'number') return value
    
        decimal = decimal || lib.settings.number.decimal
    
        let regex = new RegExp('[^0-9-' + decimal + ']', 'g'),
            unformatted = parseFloat(
                ('' + value)
                .replace(/\((?=\d+)(.*)\)/, '-$1')
                .replace(regex, '') 
                .replace(decimal, '.')
            )
    
        return !isNaN(unformatted) ? unformatted : 0
    },
    toFixed (value: any, precision: any) {
        precision = this.checkPrecision(precision, lib.settings.number.precision)
        let exponentialForm = Number(lib.unformat(value) + 'e' + precision)
        let rounded = Math.round(exponentialForm)
        let finalResult = Number(rounded + 'e-' + precision).toFixed(precision)
    
        return finalResult
    },
    formatNumber (number: any, precision: any, thousand: any, decimal: any) {
        if (utils.__isArray(number)) {
            return utils.__map(number, (val: any) => {
                return this.formatNumber(val, precision, thousand, decimal)
            })
        }
    
        number = this.unformat(number)
    
        let opts = utils.__defaults(
                (utils.__isObject(precision) ? precision : {
                precision: precision,
                thousand: thousand,
                decimal: decimal
                }),
                lib.settings.number
            ),
            usePrecision = this.checkPrecision(opts.precision),
            negative = number < 0 ? '-' : '',
            base = parseInt(this.toFixed(Math.abs(number || 0), usePrecision), 10) + '',
            mod = base.length > 3 ? base.length % 3 : 0
    
        return negative + (mod ? base.substr(0, mod) + opts.thousand : '') + base.substr(mod).replace(/(\d{3})(?=\d)/g, '$1' + opts.thousand) + (usePrecision ? opts.decimal + this.toFixed(Math.abs(number), usePrecision).split('.')[1] : '')
    },
    formatMoney (number: any, symbol: any, precision: any, thousand: any, decimal: any, format: any) {
        if (utils.__isArray(number)) {
            return utils.__map(number, (val: any) => {
                return this.formatMoney(val, symbol, precision, thousand, decimal, format)
            })
        }
    
        number = this.unformat(number)
    
        let opts = utils.__defaults(
                (utils.__isObject(symbol) ? symbol : {
                    symbol: symbol,
                    precision: precision,
                    thousand: thousand,
                    decimal: decimal,
                    format: format
                }),
                lib.settings.currency
            ),
            formats = this.checkCurrencyFormat(opts.format),
            useFormat = number > 0 ? formats.pos : number < 0 ? formats.neg : formats.zero
    
        return useFormat.replace('%s', opts.symbol).replace('%v', this.formatNumber(Math.abs(number), this.checkPrecision(opts.precision), opts.thousand, opts.decimal))
    }
}

export {
    utils,
    lib
}