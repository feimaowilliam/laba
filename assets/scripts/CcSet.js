// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var CcSet = cc.Class({
    extends: cc.Component,

    properties: {
        audioChlck: {
            displayName:'按钮点击默认声音',
            default: null,
            url: cc.AudioClip
        },
        aduioBanckground:{
            displayName:'游戏背景音乐',
            default: null,
            url: cc.AudioClip
        },
        audioEffects:{
            displayName:'游戏特效音乐',
            default: null,
            url: cc.AudioClip
        },
        audioChests:{
            displayName:'游戏宝箱音乐',
            default: null,
            url: cc.AudioClip
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
// this.fnAudioPlay(this.aduioBanckground)
// this.fnAudioPlay(this.audioChests)
// this.fnAudioPlay(this.audioEffects)
    },
    a: function () {
        // console.log(7895);

    },
    fnAudioPlay:function(audio,loop=false,volume=0.5) {
        // console.log(this.aduioBanckground);
        
       return cc.audioEngine.play(audio,loop,volume);
    },
    getAttr:function (params) {
        
        // console.log(this.params,params)
    },
    start() {

    },

    // update (dt) {},
});
