var HTTP = {
    // get
    get: function (path, callBack, basePath) {
        let xhr = cc.loader.getXMLHttpRequest()
        xhr.timeout = 3000
        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate", "text/html;charset=UTF-8")
        }
        if (basePath) {
            path = basePath + path
        } else {
            path = conf.url + path
        }
        xhr.open("GET", path, true)
        xhr.setRequestHeader("Content-Type", "application/json")
        const token = cc.sys.localStorage.getItem('nodeToken')
        if (token) {
            xhr.setRequestHeader("Authorization", "Bearer " + token)
        }
        cc.log('==== baseUrl', baseUrl, '==== path', path)
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 300)) {
                try {
                    let response = JSON.parse(xhr.responseText)
                
                    if (response.code) {
                        cc.log('****** http get res [code] err', response)
                        return callBack(response.code, response.msg)
                    }
                    cc.log("******http get path: ", path, '  \ndata:', response)
                    callBack(null, response)
                } catch (e) {
                    cc.log('****** http get [res] error: ', path, e)
                    callBack(e)
                }
            }
        };
        xhr.send(null)
    },

    // post
    post: function (path, param, callBack, basePath) {
        let xhr = cc.loader.getXMLHttpRequest()
        xhr.timeout = 3000
        if (basePath) {
            cc.log('==== basePath: ', basePath)
            path = basePath + path
        }else{
            path = conf.url + path
        }
        cc.log('==== path', path)
        xhr.open("POST", path, true)
        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate", "text/html;charset=UTF-8")
        }
        xhr.setRequestHeader("Content-Type", "application/json")
        const token = cc.sys.localStorage.getItem('nodeToken')
        if (token) {
            xhr.setRequestHeader("Authorization", "Bearer " + token)
        }
    
        xhr.onreadystatechange = function () {
            cc.log('**** xhr.status: ', xhr.status)
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 300)) {
                try {
                    let response = JSON.parse(xhr.responseText)
                    
                    if (response.code) {
                        cc.log('**** http post [path]: ', path, '**** \n', response)
                        return callBack(response.code, response.msg)
                    }
                    cc.log("**** path", path, response)
                    callBack(null, response)
                } catch (e) {
                    cc.log('****** http post [res] error: ', path, e)
                    callBack(e)
                }
                
            }
        }
        xhr.send(JSON.stringify(param))
    }
}

module.exports = HTTP
