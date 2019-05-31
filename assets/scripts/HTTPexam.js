// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        // 点确定回调
        bt.getChildByName('sure').on('click', function () {
            console.log('我们' + data.stoneNum + data.giveStoneNum)
            //HTTP start
            var dataReq = {
                "appKey": cc.static.appKey,
                "token": cc.sys.localStorage.getItem("token"),
                "deployId": data.stoneId, // 配置ID
                "totalNum": data.firstPay ? data.stoneNum + data.firstPayNum : data.stoneNum + data.giveStoneNum, //获得数量（如果为首充+=首充赠送；不是首充+=额外赠送
                "payType": data.mode == 0 ? "stone" : "tickets", // stone-购买钻石、tickets-购买房卡
            };
            conf.setSign(dataReq);

            cc.log('这里这里： ' + dataReq.totalNum);

            cc.log('FFFF' + cc.sys.localStorage.getItem("token"))

            // 微信支付测试
            cc.static.HTTP.sendWeixinPostRequest('/dxll-restful/pay/wechatPay', dataReq, function (dataRes) {
                cc.log('hahahahhahha : ' + dataRes);
                // if (dataRes.result != 0 && dataRes.result != 1) {
                //     cc.static.tips(dataRes.message);
                //     return;
                // };
                if (dataRes.result == 0) {
                    // 支付成功 // 请求成功不要显示出来
                    // cc.static.tips(dataRes.message)
                    // 调起微信支付
                    var payInfo = JSON.stringify(dataRes.datas.wxpay);
                    var date = 	JSON.parse(payInfo);
                    
                    // WeixinJSBridge.invoke('getBrandWCPayRequest', date,
                    //     function(res){
                    //         if(res.err_msg == "get_brand_wcpay_request:ok" ) {
                    //             // WeixinJSBridge.call('closeWindow');
                    //             cc.static.tips('支付成功！');

                    //             // 刷新页面 调一下
                    //             // cc.find('Canvas/mall').getComponent('MallInit').freshCommon(0, 0, 0, null, 250, 123)
                    //         } 
                    //     }
                    // ); 
                }
            }, function (err) {
                cc.log(err);
            }, cc.static.url);
        })
    },

    // update (dt) {},
});
