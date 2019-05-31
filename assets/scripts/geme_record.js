var HTTP = require('HTTP')

cc.Class({
    extends: cc.Component,

    properties: {
        scroll_view: {
            type: cc.ScrollView,
            default: null
        },
        record_prefab: {
            type: cc.Prefab,
            default: null,
        },
        content: {
            type: cc.Node,
            default: null
        },

        up_btn: {
            type: cc.Node,
            default: null
        },
        down_btn: {
            type: cc.Node,
            default: null
        },

        add_font: {
            type: cc.Font,
            default: null,
        },
        sub_font: {
            type: cc.Font,
            default: null,
        },
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.index = 1;
        this.url = "http://47.105.168.156:21500/football"

        this.scroll_view.node.on("scroll-to-top", function () {
            this.up_btn.active = false
            this.down_btn.active = true
        }, this)

        this.scroll_view.node.on("scroll-to-bottom", function () {
            this.up_btn.active = true
            this.down_btn.active = false
        }, this)
        
        this.scroll_view.node.on("scroll-ended", this.on_scroll_ended.bind(this), this)
    },

    on_scroll_ended: function () {
        if (this.index === 1) {
            cc.log('没有首次加载')
        }

        this.loadData()
    },

    loadData: function () {
        var token = cc.sys.localStorage.getItem('token')

        var obj = {
            token: token,
            page: this.index,
            num: 20,
        }

        HTTP.post('/game/gameResult', obj, function (err, ret) {
            if (ret == undefined) {
                return
            }
            if (ret.code != 0) {
                return
            }

            for (var i = 0; i < ret.data.list.length; i++) {
                var r_fab = cc.instantiate(this.record_prefab)
                r_fab.getChildByName('data').getComponent('cc.Label').string = ret.data.list[i].create_time + ''
                var bet = parseInt(ret.data.list[i].bet)
                r_fab.getChildByName('pour').getChildByName('num').getComponent('cc.Label').string = bet + ''
                var prize = ret.data.list[i].win
                prize = parseInt(prize)
                if (prize >= 0) {
                    r_fab.getChildByName('make').getChildByName('num').getComponent('cc.Label').font = this.add_font
                } else {
                    r_fab.getChildByName('make').getChildByName('num').getComponent('cc.Label').font = this.sub_font
                }
                if (prize > 0) {
                    prize = '+' + prize
                }
                r_fab.getChildByName('make').getChildByName('num').getComponent('cc.Label').string = prize + ''
                this.content.addChild(r_fab)
            }
            this.index ++
        }.bind(this))
    },

    onEnable () {
        if (this.index === 1) {
            this.loadData()
        }
        this.up_btn.active = false
        this.down_btn.active = true
    },

    onDisable () {
        this.index = 1
        this.content.removeAllChildren()
    },

    on_up: function () {
        var offset = this.scroll_view.getScrollOffset()
        this.scroll_view.scrollToOffset(cc.v2(0, offset.y - 500), 0.3)
        this.on_btn_falsh()
    },

    on_down: function () {
        var offset = this.scroll_view.getScrollOffset()
        this.scroll_view.scrollToOffset(cc.v2(0, offset.y + 500), 0.3)
        this.on_btn_falsh()
    },

    on_btn_falsh: function () {
        var offset = this.scroll_view.getScrollOffset()
        offset = Math.abs(offset.y)
        if (offset < 5) {
            this.up_btn.active = false
            this.down_btn.active = true
        } else {
            this.up_btn.active = true
            this.down_btn.active = true
        }
    },

    start () {

    },

    // update (dt) {},
});
