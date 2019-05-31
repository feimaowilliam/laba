/*************http请求部分********/
// const { baseUrl,javaBaseUrl } = require('./config');
const baseUrl = 'http://192.168.1.176:22201'

function httpGet(path, callBack, basePath) {
    let xhr = cc.loader.getXMLHttpRequest();
    xhr.timeout = 3000;
    if (cc.sys.isNative) {
        xhr.setRequestHeader("Accept-Encoding", "gzip,deflate", "text/html;charset=UTF-8"); 
    }
    if(basePath){
        path = basePath + path;
    }else{
        path = baseUrl + path;
    }
    xhr.open("GET",path, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    const token = cc.sys.localStorage.getItem('nodeToken');
    if (token) {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
    }
    console.log('baseUrl',baseUrl,'path',path);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 300)) {
            try {
                let response = JSON.parse(xhr.responseText);
            
                if (response.code) {
                    
                    console.log('networkManger,24--服务端返回错误信息---', response);
                    return callBack(response.code, response.msg);
                }
                console.log("******** path==", path, '\ndata===',response);
                callBack(null, response);
            } catch (e) {
                console.log('networkManger,30----网络请求出错----', path, e)
                callBack(e);
            }
        }
    };
    xhr.send(null);
}

function httpPost(path, param, callBack,basePath) {

    let xhr = cc.loader.getXMLHttpRequest();
    xhr.timeout = 3000;
    if(basePath){
        console.log('basePath------------------');
        path = basePath + path;
    }else{
        path = baseUrl + path;
    }
    console.log('networkManger,50-----', path)
    xhr.open("POST",  path, true);
    // // 开始转圈圈
    // console.log('开始转圈圈-------------',cc.find('Canvas'))
    // if( cc.find('Network').active == false){
    //     cc.find('Network').active = true;
    // }
   
    //  // 停止转圈圈
    // setTimeout(() => {
    //     if( cc.find('Network').active == true){
    //         cc.find('Network').active = false;
    //     }
    // },6000);
    
    if (cc.sys.isNative) {
        xhr.setRequestHeader("Accept-Encoding", "gzip,deflate", "text/html;charset=UTF-8");
    }
    xhr.setRequestHeader("Content-Type", "application/json");
    const token = cc.sys.localStorage.getItem('nodeToken');
    if (token) {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
    }

    xhr.onreadystatechange = function () {
        console.log('networkManger,55-----xhr.status', xhr.status);
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 300)) {
            // // 停止转圈圈
            // console.log('停止转圈圈============')
            // if(cc.find('Network').active ==true){
            //     cc.find('Network').active = false;
            // }
           
            try {
                let response = JSON.parse(xhr.responseText);
                
                if (response.code) {
                    console.log('networkManger,58--post--服务器返回错误信息---', path, '\n', response)
                    return callBack(response.code, response.msg);
                }
                console.log("********** path", path, response);
                callBack(null, response);
            } catch (e) {
                console.log('networkManger,65--请求出错---', path, '\nerr===', e);
                callBack(e);
            }
        }
    };
    xhr.send(JSON.stringify(param));
}

module.exports = {
    http: {
        get:httpGet,
        post:httpPost
    },
}





