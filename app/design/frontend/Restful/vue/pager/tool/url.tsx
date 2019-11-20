const URLParam: any = {
    getURLParam (url?: string) {
        let parameter: any = {}
        let query: string = url || window.location.search
        let start: number = query.indexOf('?')

        if (start > -1) {
            query = query.substring(start + 1)
        }

        if (query) {
            let queryParams: string[] = query.split('&')

            for (let k in queryParams) {
                let params: string[] = queryParams[k].split('=')
                parameter[params[0]] = decodeURIComponent(params[1]) || ''
            }
        }

        return parameter
    },
    setURLParam (obj: any) {
        const uri: string = this.changeURLParam(obj)

        return window.history.pushState(null, '', uri)
    },
    revertURLParam () {
        const location: Location = window.location
        const uri: string = `${location.origin}${location.pathname}`

        return window.history.pushState(null, '', uri)
    },
    changeURLParam (obj: any) {
        let url: string = window.location.href
        let urlParam: any = this.getURLParam()
        let objType: string = typeof obj
        let uri: string = url.substr(0, url.indexOf('?'))

        if (urlParam !== '') {
            if (objType === 'object') {
                urlParam = Object.assign(urlParam, obj)

                return uri + '?' + this.serialize(urlParam).join('&')
            } else if (objType === 'string') {
                return uri + '?' + this.serialize(this.matchParam(urlParam, obj)).join('&')
            }
        }
    },
    deleteParam (param: string) {
        let url: string = ''
        let urlParam: any = this.getURLParam()
        let uri: any = this.matchParam(urlParam, param)

        if (JSON.stringify(uri) === '{}') {
            url = window.location.origin + window.location.pathname
        } else {
            url = window.location.origin + window.location.pathname + '?' + this.serialize(uri).join('&')
        }

        return window.history.pushState(null, '', url)
    },
    matchParam (urlParam: any, obj: any) {
        Object.keys(urlParam).forEach((key: any) => {
            delete urlParam[obj]
        })

        return urlParam
    },
    serialize (urlParam: any) {
        let parameter: string[] = []
        
        Object.keys(urlParam).forEach((key: any) => {
            let value: string = urlParam[key]

            value = (typeof value === 'undefined') ? '' : urlParam[key]
            parameter.push([key, encodeURIComponent(value)].join('='))
        })

        return parameter
    }
}

export default URLParam