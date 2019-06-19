export class Request {
    public type: string
    public url: string
    public data: any

    constructor(options: any = {}) {
        this.type = options.type
        this.url = options.url
        this.data = options.data
    }

    createXHR() {
        var xhr:any = null;
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        }
        else {
            xhr = new ActiveXObject('Microsoft.XMLHTTP');
        }

        xhr.setDefaultHeader = () => {
            xhr.withCredentials = true;
            xhr.setRequestHeader('Consumer', CONSUMER);
            xhr.setRequestHeader('Contract', CONTRACT);
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.setRequestHeader('Accept', 'application/json');
        }
        
        xhr.requestCompvare = (resolve, reject) => {
            return () => {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200 || xhr.status == 304) {
                        try {
                            xhr.responseJSON = JSON.parse(xhr.responseText);
                        } catch (error) { }
                        resolve(xhr);
                    } else {
                        reject(xhr);
                    }
                }
            }
        }

        return xhr;
    }

    generate() {
        return new Promise((resolve, reject) => {
            var xhr = this.createXHR();
            xhr.open('GET', this.url, true);
            xhr.onreadystatechange = xhr.requestCompvare(resolve, reject);
            xhr.setDefaultHeader();
            xhr.send();
        });
    }
}

class GetRequest extends Request {
    constructor(options = {}) {
        super(options);

        this.setUrlParmas();
    }

    setUrlParmas() {
        if (!this.data || typeof this.data != 'object') {
            return;
        }
        var reg = new RegExp(/\?/);
        Object.keys(this.data).forEach((item) => {
            var str = reg.test(this.url) ? '&' : '?';
            this.url += str + item + '=' + this.data[item];
        })
    }
}

class PostRequest extends Request {
    constructor(options = {}) {
        super(options);
    }

    generate() {
        return new Promise((resolve, reject) => {
            var xhr = this.createXHR();
            xhr.open(this.type, this.url, true);
            xhr.onreadystatechange = xhr.requestCompvare(resolve, reject);
            xhr.setDefaultHeader();
            xhr.send(JSON.stringify(this.data));
        });
    }
}