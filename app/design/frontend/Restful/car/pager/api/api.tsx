import axios from 'axios'
import throwErr from './err'

declare let window: any

let params: any = {
    version: 'pc',
    form_key: window.commonJson.form_key
}

axios.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json'
    config.headers['tocken'] = window.commonJson.form_key
    config.baseURL = window.commonJson.base_url
    config.timeout = 10 * 1000
    return config
}, error => {
    return Promise.reject(error)
})

axios.interceptors.response.use(response => {
    if (response.data.code === 200) {  
        return Promise.resolve(response.data)
    } else if (response.data.code === 1401) {
        return Promise.reject(response.data)
    } else {
        return Promise.reject(response.data)
    }
}, (error: any) => {
    if (error && error.response) {
        let res: any = {}
        res.code = error.response.status
        res.msg = throwErr(error.response.status, error.response)
        return Promise.reject(res)
    }

    return Promise.reject(error)
})

const api: any = {
    async get (url: string, data: any) {
        try {
            let res: any = await axios.get(url, { params: Object.assign(params, data) })
            res = res.data

            return new Promise((resolve, reject) => {
                if (res.code === 0) {
                    resolve(res)
                } else {
                    reject(res)
                }
            })
        } catch (err) {
            console.error(err)
        }
    },
    async post (url: string, data: any) {
        try {
            let res: any = await axios.post(url, Object.assign(params, data))
            res = res.data

            return new Promise((resolve, reject) => {
                if (res.code === 0) {
                    resolve(res)
                } else {
                    reject(res)
                }
            })
        } catch (err) {
            console.warn(err)
        }
    }
}

export default api