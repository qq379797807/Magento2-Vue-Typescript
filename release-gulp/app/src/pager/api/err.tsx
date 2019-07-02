const throwErr = (code: number, res: any): string => {
    let message: string = 'Request error'

    switch (code) {
        case 400:
            message = 'Request error'
            break
        case 401:
            message = 'Unauthorized, please log in'
            break
        case 403:
            message = 'Access denied'
            break
        case 404:
            message = `Error in request address: ${res.config.url}`
            break
        case 408:
            message = 'The request timeout'
            break
        case 500:
            message = 'Server internal error'
            break
        case 501:
            message = 'Service not implemented'
            break
        case 502:
            message = 'Gateway error'
            break
        case 503:
            message = 'Service unavailable'
            break
        case 504:
            message = 'Gateway timeout'
            break
        case 505:
            message = 'The HTTP version is not supported'
            break
        default:
            break
    }

    return message
}

export default throwErr