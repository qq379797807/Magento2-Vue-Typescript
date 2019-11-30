import { VueConstructor } from 'vue'

interface CookiesConfig {
    expires?: string
    path?: string
}

const VueCookies: any = {
    install: (Vue: VueConstructor, options?: CookiesConfig) => {
        let defaultConfig: CookiesConfig = {
            expires: '1d',
            path: '; path=/'
        }

        let globalConfigs: CookiesConfig = Object.assign(defaultConfig, options)

        const Cookies: any = {
            get: (key: string) => {
                let value: any = decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null
        
                if (value && value.substring(0,1) === "{" && value.substring(value.length-1,value.length) === "}") {
                    try {
                        value = JSON.parse(value)
                    } catch (e) {
                        return value
                    }
                }
        
                return value
            },
            set: (key: string, value: string, expireTimes?: any, path?: string, domain?: string, secure?: boolean) => {
                if (!key) {
                    throw new Error(`cookie name is not find in first argument`)
                } else if (/^(?:expires|max\-age|path|domain|secure)$/i.test(key)) {
                    throw new Error(`cookie key name illegality, current key name: ${key}`)
                }

                // support json object
                if (value && value.constructor === Object) {
                    value = JSON.stringify(value)
                }

                let _expires: string = ''

                expireTimes = expireTimes === undefined ? globalConfigs.expires : expireTimes

                if (expireTimes && expireTimes != 0) {
                    switch (expireTimes.constructor) {
                        case Number:
                            if(expireTimes === Infinity || expireTimes === -1) {
                                _expires = "; expires=Fri, 31 Dec 9999 23:59:59 GMT"
                            } else {
                                _expires = "; max-age=" + expireTimes
                            }
                            break
                        case String:
                            if (/^(?:\d{1,}(y|m|d|h|min|s))$/i.test(expireTimes)) {
                                // get capture number group
                                let _expireTime: string = expireTimes.replace(/^(\d{1,})(?:y|m|d|h|min|s)$/i, "$1")

                                // get capture type group , to lower case
                                switch (expireTimes.replace(/^(?:\d{1,})(y|m|d|h|min|s)$/i, "$1").toLowerCase()) {
                                    // Frequency sorting
                                    case 'm': 
                                        _expires = "; max-age=" + +_expireTime * 2592000
                                        break // 60 * 60 * 24 * 30
                                    case 'd': 
                                        _expires = "; max-age=" + +_expireTime * 86400
                                        break // 60 * 60 * 24
                                    case 'h': 
                                        _expires = "; max-age=" + +_expireTime * 3600 
                                        break // 60 * 60
                                    case 'min':  
                                        _expires = "; max-age=" + +_expireTime * 60
                                        break // 60
                                    case 's': 
                                        _expires = "; max-age=" + _expireTime
                                        break
                                    case 'y': 
                                        _expires = "; max-age=" + +_expireTime * 31104000
                                        break // 60 * 60 * 24 * 30 * 12
                                    default: 
                                        new Error(`unknown exception of 'set operation'`)
                                }
                            } else {
                                _expires = "; expires=" + expireTimes
                            }

                            break
                        case Date:
                            _expires = "; expires=" + expireTimes.toUTCString()
                            break
                    }
                }

                document.cookie = encodeURIComponent(key) + "=" + encodeURIComponent(value) + _expires + (domain ? "; domain=" + domain : "") + (path ? "; path=" + path : globalConfigs.path) + (secure ? "; secure" : "")

                return Cookies
            },
            remove: (key: string, path: string, domain: string) => {
                if (!key || !Cookies.isKey(key)) {
                    return false
                }
        
                document.cookie = encodeURIComponent(key) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (domain ? "; domain=" + domain : "") + (path ? "; path=" + path : globalConfigs.path)

                return Cookies
            },
            isKey: (key: string) => {
                return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie)
            },
            keys: () => {
                if (!document.cookie) return []
        
                let _keys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/)
        
                for (let _index = 0; _index < _keys.length; _index++) {
                    _keys[_index] = decodeURIComponent(_keys[_index])
                }
        
                return _keys
            }
        }

        Vue.prototype.$cookies = Cookies
    }
}

export default VueCookies