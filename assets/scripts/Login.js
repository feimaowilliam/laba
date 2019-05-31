cc.Class({
    extends: cc.Component,

    properties: {
        loadStr: {
            type: cc.Label,
            default: null
        },
        loadBar: {
            type: cc.ProgressBar,
            default: null
        },
        pao: {
            type: cc.Node,
            default: null
        }
    },

    onLoad () {
        // _this = this;

        // 预加载Game场景
        cc.director.preloadScene("Game", function () {
            cc.log("Game scene preloaded");
        });

        this.pao.runAction(cc.moveTo(1, 220, -282))
    },

    start () {

    },

    update (dt) {
        this.loadBar.progress += dt * 1.2;

        if (this.loadBar.progress <= 1) {
            this.loadStr.string = parseInt(this.loadBar.progress * 100) + '%'
        } else {
            // 加载Game场景
            cc.director.loadScene('Game')
        }
    },
});
