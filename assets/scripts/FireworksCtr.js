var _this;

cc.Class({
    extends: cc.Component,

    properties: {
        fireNode: cc.Node, 
        firePrefab: {
            type: cc.Prefab,
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        _this = this;
        // 烟花左
        _this.fireworksLeft();
        // 烟花右
        _this.scheduleOnce(function() {
            _this.fireworksRight();
        }, 1.5);
    },

    // 烟花左
    fireworksLeft: function () {
        _this.schedule(function() {
            var node = cc.instantiate(this.firePrefab);
            node.parent = _this.fireNode;
            var x = _this.freeNum(-150, -276);
            var y = _this.freeNum(89, -18);
            node.setPosition(x, y);

            // 销毁
            setTimeout(function () {
                node.destroy();
            }.bind(this),1600);
        }, 2);
    },

    // 烟花右
    fireworksRight: function () {
        _this.schedule(function() {
            var node = cc.instantiate(this.firePrefab);
            node.parent = _this.fireNode;
            var x = _this.freeNum(280, 188);
            var y = _this.freeNum(138, 39);
            node.setPosition(x, y);

            // 销毁
            setTimeout(function () {
                node.destroy();
            }.bind(this),1600);
        }, 2);
    },

    // free num
    freeNum: function (m, n) {
        return Math.floor(Math.random()*(m - n) + n);
    },

    // update (dt) {},
});
