// var oNativeJdbc = cc.Class({
//     extends: cc.Component,

//     properties: {
//     },




// });


var obj = {

    /**
     *ajax方法，获取后台返回的数据
     *
     * @param {object} 
     * object.method 连接方式
     * opt.url 连接地址
     * opt.data 传输数据
     * opt.success 成功之后的回调函数
     * opt.dataType 传输值类型
     * opt.async 是否开启异步请求
     */
    ajax: function (opt) {
        opt = opt || {};
        opt.method = opt.method.toUpperCase() || 'POST';
        opt.url = opt.url || '';
        opt.async = opt.async || true;
        opt.data = opt.data || null;
        opt.success = opt.success || function () { };
        opt.dataType = opt.dataType || "json";
        var xmlHttp = null;
        if (XMLHttpRequest) {
            xmlHttp = new XMLHttpRequest();
        }
        else {
            xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
        } var params = [];
        for (var key in opt.data) {
            params.push(key + '=' + opt.data[key]);
        }
        var postData = params.join('&');
        if (opt.method.toUpperCase() === 'POST') {
            xmlHttp.open(opt.method, opt.url, opt.async);
            // xmlHttp.setRequestHeader('dataType', 'json');
            // xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
            xmlHttp.setRequestHeader('Content-Type', 'application/json');
            xmlHttp.send(postData);
        }
        else if (opt.method.toUpperCase() === 'GET') {
            xmlHttp.open(opt.method, opt.url + '?' + postData, opt.async);
            xmlHttp.send(null);
        }
        xmlHttp.onreadystatechange = function () {
            if (opt.dataType != 'jsonp') {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                    opt.success(xmlHttp.responseText);
                }
            } else {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                    var oScript = document.createElement('script');
                    document.body.appendChild(oScript);

                    var callbackname = 'wangxiao'
                    oScript.src = opt.url + "?" + postData + '&callback=' + callbackname;

                    window['wangxiao'] = function (data) {
                        opt.success(data);
                        document.body.removeChild(oScript);
                    };
                }


            }

        };
    },
}

module.exports = obj;