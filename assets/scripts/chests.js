cc.Class({
    extends: cc.Component,

    properties: {
        leftCurtain: {
            default: null,
            type: cc.Node
        },
        rightCurtain: {
            default: null,
            type: cc.Node
        },
        chestsList: {
            default: null,
            type: cc.Node
        },
        chest_png: {
            type: cc.SpriteFrame,
            default: null
        }
    },

    onEnable() {
        // console.log('该组件已启用', this.leftCurtain.x + this.leftCurtain.width);
        // 窗帘的拉动
        let lAnin = cc.moveTo(2, -288, 156)
        this.leftCurtain.runAction(lAnin);

        let rAnin = cc.moveTo(2, 288, 156)
        this.rightCurtain.runAction(rAnin);

    },

    onDisable() {
        // console.log('该组件已销毁');

        // this.node.stopAllActions();
        this.chestsList.getChildren('chests').forEach(item => {
            // 更换宝箱的默认图片
            item.getComponent(cc.Sprite).spriteFrame = this.chest_png

            // item.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(cc.url.raw('/resources/texturse/game/Chests1.png'));
            // 播放默认动画
            item.getComponent(cc.Animation).play('chests');
            item.getComponent(cc.Button).interactable=true;
            // cc.loader.loadRes()
        });

        // let lAnin = cc.place(this.leftCurtain.x - this.leftCurtain.width, 156)
        // this.leftCurtain.runAction(lAnin);
        this.leftCurtain.setPosition(-410, 156)

        // let rAnin = cc.place(this.rightCurtain.x + this.leftCurtain.width, 156)
        // this.rightCurtain.runAction(rAnin);
        this.rightCurtain.setPosition(410, 156)
    },

    aninMod: function name(target, state) {
        target == this.leftCurtain
        let leftAnin = cc.moveTo(2)
        target.runAction(leftAnin);
    },

    // start () {

    // },
    fnClickChests: function (e) {
        let node = e.target;
        var chestsMoveTop = cc.moveTo(1, 0, 300), anim = node.getComponent(cc.Animation);
        let callfn = cc.callFunc(function (target) {
            this.fnOpenOrClose('1', 'winningBox');
        }, this)
        // 停止宝箱摇动动画
        anim.stop('chests');
        conf.chests.DCDST = node;
        conf.chests.historyPosition = node.getPosition();
        // console.log(conf.chests.historyPosition)
        let sequence = cc.sequence(cc.spawn(cc.scaleTo(0.5, 2, 2), cc.moveTo(0.5, 0, 280)), callfn);
        node.runAction(sequence);
        anim.play('openChests');
        node.getComponent(cc.Button).interactable = false;

        // this.fnOpenOrClose(-1,'winningBox');
    },

});
