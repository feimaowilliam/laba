cc.Class({
    extends: cc.Component,

    properties: {
        pulldown: {
            type: cc.Node,
            default: null,
            tooltips: '下拉框'
        },
        splash: {
            type: cc.Node,
            default: null,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.splash.active = false
        console.log(this.pulldown.active)
    },

    on_btn_pulldown: function () {
        this.pulldown.active = !this.pulldown.active
        console.log(this.pulldown.active)
        if (this.pulldown.active) {
            this.splash.active = true
        } else {
            this.splash.active = false
        }
    },

    on_splash_click: function () {
        this.pulldown.active = false
        this.splash.active = false
        console.log(this.pulldown.active)

    },

    // update (dt) {},
});
