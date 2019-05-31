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
        clickSound: {
            default: null,
            displayName: "按钮声音",
            url: cc.AudioClip
        },
        bgm: {
            default: null,
            displayName: '背景音乐',
            url: cc.AudioClip
        },
        sfxKit: {
            default: null,
            displayName: '效果音乐',
            url: cc.AudioClip
        }

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        
        // let click=cc.find('Canvas/Audio/click').getComponent(cc.AudioSource);
        // this.node.on(cc.Node.EventType.TOUCH_START,function() {
        //     click.play()
        //     console.log('播放完毕');

        // })

    },

    // start () {

    // },

    // update (dt) {},
});
