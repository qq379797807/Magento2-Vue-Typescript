import axios from 'axios'
import throwErr from './err'

let params: any = {
    form_key: window.commonJson.form_key
}

axios.defaults.baseURL = window.commonJson.base_url
axios.defaults.headers['Accept'] = 'application/json'
axios.defaults.headers['Content-Type'] = 'application/json'

axios.interceptors.request.use(config => {
    config.timeout = 10 * 1000
    return config
}, error => {
    return Promise.reject(error)
})

axios.interceptors.response.use(res => {
    let xhr: any = res.request
    if (xhr.readyState == 4) {
        if (xhr.status == 200 || xhr.status == 304) {
            return Promise.resolve(res)
        } else {
            return Promise.resolve(res)
        }
    } else {
        return Promise.resolve(xhr)
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

            return new Promise((resolve, reject) => {
                if (res.status == 200) {
                    resolve(res.data)
                } else {
                    reject(res.data)
                }
            })
        } catch (err) {
            console.error(err)
        }
    },
    async post (url: string, data: any) {
        try {
            let res: any = await axios.post(url, Object.assign(params, data))

            return new Promise((resolve, reject) => {
                if (res.status == 200) {
                    resolve(res.data)
                } else {
                    reject(res.data)
                }
            })
        } catch (err) {
            console.warn(err)
        }
    }
}

export default api