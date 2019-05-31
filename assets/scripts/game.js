// let pim = require("nativeJdbc"),
var ModSet = require('MethodSet')
var CcSet = require('CcSet')
var Utils = require('Utils')
var HTTP = require('HTTP')

var _this;

cc.Class({
    extends: cc.Component,
    // extends:CcSet,

    properties: {
        is_local: true,
        oResiduum: {
            default: null,
            type: cc.Node
        },
        oSudoku: {
            default: null,
            type: cc.Node
        },
        odds: {
            default: null,
            type: cc.Label
        },
        oiltankNum: {
            default: null,
            type: cc.Label
        },
        oResult: {
            default: null,
            type: cc.Label
        },
        oBet: {
            default: null,
            type: cc.Label
        },
        oGold: {
            default: null,
            type: cc.Label
        },
        oTieXiao: {
            default: null,
            type: cc.Node
        },
        oChestsBox: {
            default: null,
            type: cc.Node
        },
        freeNum: {
            default: null,
            type: cc.Label
        },
        freeSliderNum: cc.Label,
        audioBox: {
            default: null,
            type: cc.Node
        },
        // playBtn: {
        //     default: null,
        //     type: cc.Node
        // },

        audioChlck: {
            displayName: '按钮点击默认声音',
            default: null,
            url: cc.AudioClip
        },
        aduioBanckground: {
            displayName: '游戏背景音乐',
            default: null,
            url: cc.AudioClip
        },
        audioEffects: {
            displayName: '游戏特效音乐',
            default: null,
            url: cc.AudioClip
        },
        audioHengxian: {
            displayName: '线条音乐',
            default: null,
            url: cc.AudioClip
        },
        audioChests: {
            displayName: '游戏宝箱音乐',
            default: null,
            url: cc.AudioClip
        },

        btnBox: {
            default: [],
            type: cc.Node
        },
        info: {
            default: null,
            type: cc.Node
        },
        audioBlock: {
            default: null,
            type: cc.Node
        },
        volumnSlider: {
            default: null,
            type: cc.Slider
        },
        audioStr: {
            default: null,
            type: cc.Label,
        },
        holdTimeEclipse: 0,//用来检测长按
        holdClick_add: false,
        holdClick_lessen: false,
        audioPlay: null,
        bgNode: null,

        playBtn: {
            type: cc.Sprite,
            default: null,
            tooltip: '开始按钮'
        },
        autoBtn: {
            type: cc.Sprite,
            default: null,
            tooltip: '自动游戏按钮'
        },

        play_frame: {
            type: cc.SpriteFrame,
            default: [],
            tooltip: '开始按钮的两种图片 0默认 1游戏中' 
        },
        auto_frame: {
            type: cc.SpriteFrame,
            default: [],
            tooltip: '自动游戏的两种图片 0默认 1自动游戏'
        },

        five: {
            type: cc.SpriteFrame,
            default: null
        },
        nine: {
            type: cc.SpriteFrame,
            default: null
        },
        five_one: {
            type: cc.SpriteFrame,
            default: null
        },
        nine_one: {
            type: cc.SpriteFrame,
            default: null
        },

        game_record_node: {
            type: cc.Node,
            default: null,
            tooltip: '战绩节点'
        },

        box_title_node: {
            type: cc.Sprite,
            default: null
        },
        box_win: {
            type: cc.SpriteFrame,
            default: null,
        },
        box_lose: {
            type: cc.SpriteFrame,
            default: null
        },

        // pulldown: {
        //     type: cc.Node,
        //     default: null,
        //     tooltips: '下拉框'
        // },
        // splash: {
        //     type: cc.Node,
        //     default: null,
        // }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        _this = this;

        cc.play_btn = cc.find('Canvas/MainPart/buttonBox/play/btn')
        cc.play_normal = this.play_frame[0]
        cc.playing = this.play_frame[1]

        // 获取token
        // conf.token = this.getQueryVariable('token');

        // 初始化游戏背景音乐
        this.bgNode = cc.audioEngine.play(this.aduioBanckground, true, conf.volume);

        // 初始化音量
        this.volumnSlider.progress = conf.volume;
        this.audioStr.string = parseInt(conf.volume * 100) + '%';

        // 初始化游戏点击音效
        this.btnBox.forEach(item => {
            item.on(cc.Node.EventType.TOUCH_START, (e) => {
                cc.audioEngine.play(this.audioChlck, false, conf.volume);
            }, this)
        })

        // this.count = 0 // XX

        // fit Screen
        // this.fitScreen()
        cc.game.on(cc.game.EVENT_SHOW, this.reflash);

        cc.game.on(cc.game.EVENT_HIDE, function () {
            if (conf.autoState) {
                conf.switch_tag = true
            }
        });
    },

    // 从后台切回前台回调
    reflash: function () {
        if (conf.autoState) { // 在自动模式下
            return
        }

        if (conf.switch_tag !== true) {
            return
        }

        conf.switch_tag = false

        // var onceData = cc.sys.localStorage.getItem('onceData')
        // onceData = JSON.parse(onceData)
        var onceData = conf.last_data
        if (!onceData) { // 没数据
            return
        }
        
        cc.log(' ==== LAST Data is ', onceData)

        conf.play = onceData.data;
        if (onceData.msg.indexOf('投注成功') == -1) {
            conf.gloGame.fnInfo('投注失败！');
            if (!conf.autoState) {
                conf.gloGame.playBtn.getComponent(cc.Button).interactable = true;

                // ModSet.fnSpriteFrame(conf.gloGame.playBtn, '/resources/texturse/game/play.png');
                this.playBtn.spriteFrame = this.play_frame[0]
            }
            return;
        }
        conf.user = conf.play.user;

        // 保存金幣
        conf.sum = parseInt(conf.play.user.score);

        // console.log('start', conf.user.score);

        console.log(' ==== Once Last')
        conf.gloGame.fnSudoku()
    },

    // Fit Screen
    fitScreen: function () {
        var x = document.body.clientWidth
        var y = document.body.clientHeight

        // bg
        cc.find('Canvas/Background1').width = x;
        cc.find('Canvas/Background1').height = y;

        // view
        cc.view.setFrameSize(x, y);
    },

    start() {
        // 关闭左下角的fps面板
        // cc.director.setDisplayStats(false);
        // 将game赋值给全局变量
        conf.gloGame = this;
        //赋值九宫格
        conf.oSudoku = this.oSudoku;
        // 初始化用户数据
        // cc.log('token: ' + conf.token);
        // if (!conf.token) {
        //     return this.fnTips('请传送token');
        // }
        this.init();
        this.fnInfo('载入成功！')
        console.log(cc.sys.localStorage.getItem('audioState'), 86);

        // 建立storage
        if (cc.sys.localStorage.getItem('audioState') == null) {
            initStorage();
        }

        function initStorage() {
            cc.sys.localStorage.setItem('audioState', true);
            // cc.sys.localStorage.setItem('autoNumber', 15);
        }
        conf.audioState = JSON.parse(cc.sys.localStorage.getItem('audioState'));
        // conf.autoNumber = JSON.parse(cc.sys.localStorage.getItem('autoNumber'));
        // if (!conf.audioState) {
        //     this.fnAudioState()
        // }
        this.fnAudioState()

    },
    // 获取页面参数值
    getQueryVariable (variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) { return pair[1]; }
        }
        return (false);
    },
    init: function () {
        var token = ''
        if (this.is_local) { // 本地测试
            conf.token = '2764f55eb1fe7c026f33b327010fd25'
        } 
        else { // 2.0 willliam
            if (!cc.public.token) {
                this.fnTips('用户token信息为空, 请检查后重试!')
                return
            }
            conf.token = cc.public.token
        }

        HTTP.post('/game/entry', {token: conf.token}, function (err, data) {
            if (data.code != 0) {
                console.log(' ****** /game/entry XXXX')
                return
            }
            if (err) {
                console.log(err)
                return
            }
            conf.token = data.data.token
            cc.sys.localStorage.setItem('token', conf.token)
            console.log(' ====TOKEN==== ', conf.token)
            conf.user = data.data.user;
            conf.user.bet_score = parseInt(conf.user.bet_score)

            // console.log('===== user data: ', conf.user)

            if (data.msg.indexOf('进入成功') == -1) {
                conf.gloGame.fnInfo('游戏初始化失败，请检查网络！');
                return;
            };

            // 初始化金币
            this.fnStr(this.oGold, conf.user.score);
            // 初始化倍数
            this.fnStr(this.oBet, conf.user.bet_score);
            // 初始化油桶
            this.fnStr(this.oResiduum, 'x' + conf.user.collections);

            if (conf.gloGame.playBtn.getComponent(cc.Button).interactable) {
                // 初始化显示倍数
                this.fnStr(this.odds, '')
                // 初始化自动次数

                // 初始化标语
                this.fnStr(this.oResult, '')
                // 初始化自动次数
                // this.fnStr();

            }
        }.bind(this))
        
    },

    fnRandomNum: function (iZero, iEnd) {
        if (iZero >= iEnd) {
            fnEio(RangeError, '随机数临界值应大于起始值')
        }
        let iNum = 0;
        iNum = parseInt(Math.random() * iEnd + iZero);
        return iNum;
    },
    
    fnDetection: function () {
        return function () {
            if (conf.user == null || conf.user.scene == '') {
                console.log('游戏错误，请退出游戏后重试');
                return;
            }
        }
    },

    fnPlay: function () {
        console.log('xxx xxx')

        if (conf.user == null || conf.user.scene == '') {
            this.fnInfo('载入失败，请退出游戏后重试');
            return;
        }
        
        // console.log(ModSet);
        var coin_num = parseInt(conf.user.score)
        if (coin_num < 0 || coin_num < conf.user.bet_score) {
            this.fnInfo('金币不足, 请充值金币后再试')
            if (conf.autoState == true) {
                this.fnAutoBtn()
            }
            this.playBtn.spriteFrame = this.play_frame[0]
            conf.gloGame.playBtn.getComponent(cc.Button).interactable = true
            return;
        }
        
        // ModSet.fnSpriteFrame(conf.gloGame.playBtn, '/resources/texturse/game/playIng.png')
        this.playBtn.spriteFrame = this.play_frame[1]

        conf.History.gold = conf.user.score;
        conf.History.bet = conf.user.bet_score;

        conf.gloGame.playBtn.getComponent(cc.Button).interactable = false;
        
        // 判断游戏场景模式
        switch (conf.user.scene) {
            // ok
            case 1:
                // this.count++ // XX
                // cc.log('XXOO: ', this.count)
                // console.log('进入正常模式');
                // ************************************* william1
                // pim.ajax({
                //     method: 'POST', async: true,
                //     // xhr.setRequestHeader("Content-Type", "application/json"),
                //     url: conf.url + '/game/play', success: (data) => {
                //         console.log('正常模式游戏数据: ' + data);

                //         conf.play = (JSON.parse(data)).data;
                //         if ((JSON.parse(data)).msg.indexOf('投注成功') == -1) {
                //             conf.gloGame.fnInfo('投注失败！');
                //             if (!conf.autoState) {
                //                 conf.gloGame.playBtn.getComponent(cc.Button).interactable = true;
                //                 ModSet.fnSpriteFrame(conf.gloGame.playBtn, '/resources/texturse/game/play.png');
                //             }
                //             return;
                //         }
                //         conf.user = conf.play.user;

                //         // 保存金幣
                //         conf.sum = parseInt(conf.play.user.score);

                //         // console.log('start', conf.user.score);

                //         conf.gloGame.fnSudoku()
                //         // conf.gloGame.fncallBack();
                //     }
                // })

                // *************************************
                // console.log('进入正常模式');
                HTTP.post('/game/play', {token: conf.token}, function (err, data) {
                    if (data.code != 0) {
                        console.log(' ****** /game/play XXXX')
                        return
                    }
                    if (err) {
                        console.log(err)
                        return
                    }
                    console.log('正常模式游戏数据: ' + data)
                    conf.last_data = data
                    // var data_str = JSON.stringify(data)
                    // cc.sys.localStorage.setItem('onceData', data_str)

                    conf.play = data.data;
                    if (data.msg.indexOf('投注成功') == -1) {
                        conf.gloGame.fnInfo('投注失败！');
                        if (!conf.autoState) {
                            conf.gloGame.playBtn.getComponent(cc.Button).interactable = true;
                            // ModSet.fnSpriteFrame(conf.gloGame.playBtn, '/resources/texturse/game/play.png');
                            this.playBtn.spriteFrame = this.play_frame[0]
                        }
                        return;
                    }
                    conf.user = conf.play.user;

                    // 保存金幣
                    conf.sum = parseInt(conf.play.user.score);

                    // console.log('start', conf.user.score);

                    console.log('AAA')
                    conf.gloGame.fnSudoku()
                    // conf.gloGame.fncallBack();
                }.bind(this))

                break;
            case 2:
                // console.log('进入免费模式');
                // ********************************* william
                // pim.ajax({
                //     method: 'POST', async: true,
                //     url: conf.url + '/game/free', success: (data) => {

                //         conf.play = (JSON.parse(data)).data;
                //         if ((JSON.parse(data)).msg.indexOf('投注成功') == -1) {
                //             conf.gloGame.fnInfo('投注失败！');
                //             return;
                //         }
                //         console.log('免费模式游戏数据: ' + conf.play);

                //         conf.user = conf.play.user;
                //         // let show=cc.sequence(cc.fadeIn(1.0)) 

                //         if (conf.user.free > 8) {
                //             // 切换游戏场景
                //             conf.gloGame.fnHAState(-1);


                //         } else {

                //             conf.autoState = true;
                //             conf.gloGame.fnSudoku();
                //         }
                //         conf.gloGame.freeNum.getComponent(cc.Label).string = conf.user.free;
                //     }
                // })
                // ************************************ william
                HTTP.post('/game/free', {token: conf.token}, function (err, data) {
                    if (data.code != 0) {
                        console.log(' ****** /game/free XXXX')
                        return
                    }
                    if (err) {
                        console.log(err)
                        return
                    }
                    conf.play = data.data
                    if (data.msg.indexOf('抽奖成功') == -1) {
                        conf.gloGame.fnInfo('投注失败！')
                        return
                    }
                    console.log('免费模式游戏数据: ' + conf.play)

                    conf.user = conf.play.user
                    // let show=cc.sequence(cc.fadeIn(1.0))

                    if (conf.user.free > 8) {
                        // 切换游戏场景
                        conf.gloGame.fnHAState(-1)
                    } else {
                        conf.autoState = true
                        console.log('BBB')
                        conf.gloGame.fnSudoku()
                    }
                    conf.gloGame.freeNum.getComponent(cc.Label).string = conf.user.free
                }.bind(this))

                // conf.gloGame.fncallBack();
                break;

            case 3:
                // console.log('进入抽奖模式');

                conf.gloGame.oChestsBox.active = true;

                break;

            default:
                break;
        }



    },

    fnOnLongClickListener: function (target, hold) {


    },

    fncallBack: function () {
        // 开始回调

        console.log('自动第', conf.k, conf.autoState);
        if (conf.k >= conf.autoNumber - 1 || !conf.autoState) {

            let autoBtn = cc.find('Canvas/MainPart/buttonBox/auto'), prentActive = autoBtn.getChildByName('autoTrue');
            // prentActive.active = !prentActive.active;
            // 恢复开始按钮点击
            cc.find('Canvas/MainPart/buttonBox/play/btn').getComponent(cc.Button).interactable = true;
            // ModSet.fnSpriteFrame(conf.gloGame.playBtn, '/resources/texturse/game/play.png');
            // this.playBtn.spriteFrame = this.play_frame[0]
            cc.play_btn.getComponent('cc.Sprite').spriteFrame = cc.play_normal

            // 恢复自动按钮点击
            conf.autoState = !conf.autoState;

            autoBtn.getChildByName('btn').active = !autoBtn.getChildByName('bg').active;
            // autoBtn.getChildByName('btn').getChildByName('str').active = !autoBtn.getChildByName('btn').getChildByName('str').active;

            // 自动按钮底色
            cc.find('Canvas/MainPart/buttonBox/auto/autoTrue').active = conf.autoState
            cc.find('Canvas/MainPart/buttonBox/auto/btn').active = !conf.autoState
            
            // 自动按钮上下
            var autoBtAnm = cc.find('Canvas/MainPart/buttonBox/auto/bg').getComponent(cc.Animation);
            autoBtAnm.play(conf.autoState ? 'autoToTop' : 'autoToBottom');

            // ModSet.fnSpriteFrame(conf.gloGame.playBtn, '/resources/texturse/game/play.png');
            // this.playBtn.spriteFrame = this.play_frame[0]

            return
        }

        conf.k++;
        conf.gloGame.fnStr(cc.find('Canvas/MainPart/buttonBox/auto').getChildByName('btn').getChildByName('str'), (conf.autoNumber - conf.k - 1))

        conf.gloGame.fnPlay()
    },

    fnSudoku: function () {
        this.oTieXiao.getChildByName('x').stopAllActions();
        this.oTieXiao.getChildByName('x').runAction(cc.place(-700, 170));

        // 播放转盘音乐
        this.audioPlay = cc.audioEngine.play(this.audioEffects, true, conf.volume)
        
        // 显示为小数点
        // this.fnStr(this.oGold, (parseFloat(conf.History.gold) - parseFloat(conf.History.bet)).toFixed(2))

        this.fnStr(this.oGold, (parseFloat(conf.History.gold) - parseFloat(conf.History.bet)))

        this.fnStr(this.odds, '')
        this.fnStr(this.oResult, '');

        // this.oGold
        let aSudokuList = conf.oSudoku.getChildByName('markBox').children, asArr = [];
        aSudokuList.forEach((mark, i) => {
            mark.children.forEach(item => {
                let x = item.x, y = item.y, itemChildren = item.children,
                    sequence = cc.repeatForever(cc.sequence(cc.place(x, 0), cc.moveTo(.7, x, (y - itemChildren[0].height * parseInt(((itemChildren.length * itemChildren[0].height - Math.abs(y)) + 2) / 200)))));
                sequence.setTag(i);
                asArr.push(i)

                item.runAction(sequence)

            });

        });

        this.clock1 = setTimeout(() => {
            let wnp = false;

            aSudokuList.forEach((mark, i) => {
                mark.children.forEach(item => {
                    let x = item.x, y = item.y, itemChildren = item.children;
                    item.stopActionByTag(i)
                    // COCO
                    item.y = y + itemChildren[0].height * 2;
                    let decelerate = cc.moveTo(1, x, -(item.childrenCount * itemChildren[0].height) + conf.play.img[i] * itemChildren[0].height).easing(cc.easeOut(20.0));
                    item.runAction(decelerate);
                    if (conf.play.img[i] == 10) {
                        wnp = true;
                    }
                });
            });
            if (wnp) {
                conf.wnp++;
                // console.log('万能牌', conf.wnp);
            }
            // 横线特效
            let animArr = [];
            conf.play.win_line.forEach((item, i) => {
                switch (item.line) {
                    case 1:
                        animArr.push({ x: 700, y: 230, init: { x: -700, y: 230, r: 0 } });
                        break;
                    case 2:
                        animArr.push({ x: 700, y: 0, init: { x: -700, y: 0, r: 0 } });

                        break;
                    case 3:
                        animArr.push({ x: 700, y: -230, init: { x: -700, y: -230, r: 0 } });

                        break;
                    case 4:
                        animArr.push({ x: 563, y: -536, init: { x: -563, y: 536, r: -45 } });

                        break;
                    case 5:
                        animArr.push({ x: 520, y: 527, init: { x: -513, y: -506, r: 45 } });

                        break;
                    case 6:
                        animArr.push({ x: -230, y: -640, init: { x: -230, y: 640, r: -90 } });

                        break;
                    case 7:
                        animArr.push({ x: -5, y: -640, init: { x: -5, y: 640, r: -90 } });

                        break;
                    case 8:
                        animArr.push({ x: 222, y: -640, init: { x: 222, y: 640, r: -90 } });

                        break;
                    case 9:
                        animArr.push({ key: 9 });
                        break;
                    case 10:
                        animArr.push({ key: 10 });

                    default:
                        break;
                }
                this.fnStr(this.odds, item.score);
            })
            // 赋值给全局的中奖数组
            conf.animArr = animArr;

            if (conf.animArr != '') {
                let k = 0;
                let a = this.funCall(k);
                // console.log(conf.animArr);

                if (!conf.autoState) {
                    // console.log('没有启动自动模式', conf.autoState);

                }

            }
            cc.audioEngine.stop(this.audioPlay)

            // 处理本次循环所需时间
            let animArrTime = 0;
            animArr.forEach((item, i) => {
                // console.log(item, i);

                if (item.key !== undefined) {
                    animArrTime += 2000;

                } else {
                    animArrTime += 900;
                }
            })
            animArrTime = animArr.length == 0 ? 900 : animArrTime;

            // 恢复按钮点击 判断自动状态下不可点击
            if (!conf.autoState) {
                // console.log('no');
                // playIng
                // cc.audioEngine.stop(this.audioPlay)
                // console.log(playIng);

                this.clock2 = setTimeout(function () {
                    conf.gloGame.playBtn.getComponent(cc.Button).interactable = true;
                    // ModSet.fnSpriteFrame(conf.gloGame.playBtn, '/resources/texturse/game/play.png');
                    this.playBtn.spriteFrame = this.play_frame[0]

                }.bind(this), animArrTime)

            } else if (conf.user.free == 0 && conf.user.scene == 2) {
                // 恢复游戏场景
                conf.gloGame.fnHAState(1);
                // cc.audioEngine.stop(this.audioPlay)




            } else if (conf.user.free > 0 && conf.user.free <= 8 || conf.autoState) {
                // 延时执行的下次的动画
                // console.log('进入回调');
                // cc.audioEngine.stop(this.audioPlay)

                this.clock3 = setTimeout(conf.gloGame.fncallBack, animArrTime)
            }

            // this.init()
            
            // 金币二次赋值
            this.fnStr(this.oGold, conf.sum);

            // 金猪赋值
            this.fnStr(this.oResiduum, 'x' + conf.user.collections);

            // console.log('end', conf.user.score);

            this.fnStr(this.oResult, conf.play['total_score']);

        }, 3000);

        // console.log('动作执行');
    },
    // 横线特效
    funCall: function (i) {
        // console.log('我是i', i);

        let callfn = cc.callFunc(function () {
            // console.log('我是回调函数');

            let lastState = false;
            // console.log(conf.animArr.length, i);

            if (i >= conf.animArr.length - 1) {
                // console.log('已经完毕');
                if (!conf.autoState) {
                    // console.log('不是自动模式并且 动画执行完毕', conf.autoState);

                    i = -1;
                    lastState = true;
                } else {
                    return true;
                }
            }
            i++;

            if (lastState) {
                this.clock4 = setTimeout(() => {

                    if (conf.gloGame.playBtn.getComponent(cc.Button).interactable) {
                        this.funCall(i, conf.animArr)
                    }
                }
                    , 1200
                )
            } else {
                this.funCall(i, conf.animArr)

            }

        }, this)

        if (conf.animArr[i].key !== undefined) {
            var texiao = null;
            if (conf.animArr[i].key == 9) {
                texiao = 9;
            } else {
                texiao = 10;
            }
            let act = cc.sequence(cc.blink(2, 255), cc.callFunc(function () {
                texiaoBox.active = false;
            }), callfn)
            let texiaoBox = this.oTieXiao.getChildByName('texiao' + texiao);
            texiaoBox.active = true;
            texiaoBox.runAction(act);

            this.fnStr(this.odds, '');
            this.clock5 = setTimeout(() => {
                this.fnStr(this.odds, conf.play['win_line'][i]['score'] || '');
            }, 200)
        } else {
            // console.log(this);

            this.oTieXiao.getChildByName('x').runAction(cc.sequence(cc.place(conf.animArr[i].init.x, conf.animArr[i].init.y), cc.rotateTo(0, conf.animArr[i].init.r || 0), cc.delayTime(0.2), cc.moveTo(0.7, conf.animArr[i].x, conf.animArr[i].y), callfn))
            this.fnStr(this.odds, '');
            this.clock6 = setTimeout(() => {
                this.fnStr(this.odds, conf.play['win_line'][i]['score'] || '');
            }, 200)

        }
        cc.audioEngine.play(this.audioHengxian, false, conf.volume)

    },
    fnHAState: function (state) {
        let bg2 = this.node.getChildByName('Background2'), bg2Child = bg2.getChildByName('remainder');
        // 获取动画组件
        let anim = this.node.getChildByName('MainPart'), animChild = anim.getChildByName('buttonBox'),
            animChildAuto = animChild.getChildByName('auto'),
            leftList = cc.find('Canvas/leftList'),
            animChildPlay = animChild.getChildByName('play'),
            minus = animChild.getChildByName('betBox').getChildByName('bet').getChildByName('minus'),
            add = animChild.getChildByName('betBox').getChildByName('bet').getChildByName('add');


        // 播放动画并设置循环6次
        anim.getComponent(cc.Animation).play().repeatCount = 10;

        if (state == 1) {
            // console.log('执行恢复模式');

            animChildAuto.runAction(cc.sequence(cc.scaleTo(0, 1), cc.fadeIn(1)));
            animChildPlay.runAction(cc.sequence(cc.scaleTo(0, 1), cc.fadeIn(1)));
            minus.runAction(cc.sequence(cc.scaleTo(0, 1), cc.fadeIn(1)));
            add.runAction(cc.sequence(cc.scaleTo(0, 1), cc.fadeIn(1)));


            let seq = cc.sequence(cc.moveTo(1.5, -432.5, bg2Child.y), cc.rotateTo(0, 0), cc.callFunc(function (target) {

                conf.autoState = false;
                leftList.runAction(cc.sequence(cc.moveTo(1, -120, leftList.y), cc.callFunc(function () {
                    console.log(leftList.x);

                    // 当移出动画完成后再执行
                    bg2.runAction(cc.fadeOut(2.0));

                })))

            }, this))
            bg2Child.runAction(seq);
            conf.gloGame.playBtn.getComponent(cc.Button).interactable = true;
            // ModSet.fnSpriteFrame(conf.gloGame.playBtn, '/resources/texturse/game/play.png');
            this.playBtn.spriteFrame = this.play_frame[0]

            // 更换特殊场景的车轮和兰博基尼
            conf.oSudoku.getChildByName('markBox').children.forEach(item => {
                item.getChildByName('item').children.forEach((children, i) => {
                    if (children.name == 'i4') {
                        // ModSet.fnSpriteFrame(children, '/resources/texturse/icon/5.png');
                        children.getChildByName(cc.Sprite).spriteFrame = this.five
                    } else if (children.name == 'i8') {
                        // ModSet.fnSpriteFrame(children, '/resources/texturse/icon/9.png');
                        children.getChildByName(cc.Sprite).spriteFrame = this.nine

                    }
                });
            })

        } else {
            bg2.active = true;
            animChildAuto.runAction(cc.sequence(cc.fadeOut(1), cc.scaleTo(0, 0)));
            animChildPlay.runAction(cc.sequence(cc.fadeOut(1), cc.scaleTo(0, 0)));
            minus.runAction(cc.sequence(cc.fadeOut(1), cc.scaleTo(0, 0)));
            add.runAction(cc.sequence(cc.fadeOut(1), cc.scaleTo(0, 0)));

            let seq = cc.sequence(cc.moveTo(1.5, -210.5, bg2Child.y), cc.rotateTo(0, 0), cc.callFunc(function (target) {

                conf.autoState = true;
                console.log('CCC')
                conf.gloGame.fnSudoku();
            }, this))

            leftList.runAction(cc.sequence(cc.moveTo(1, -700, leftList.y), cc.callFunc(function () {
                // console.log(12);

                // 当移出动画完成后再执行
                bg2.runAction(cc.fadeIn(2.0));
                bg2Child.runAction(seq)

            })))


            // 更换特殊场景的车轮和兰博基尼
            conf.oSudoku.getChildByName('markBox').children.forEach(item => {
                item.getChildByName('item').children.forEach((children, i) => {
                    if (children.name == 'i4') {
                        // ModSet.fnSpriteFrame(children, '/resources/texturse/icon/5_1.png');
                        children.getChildByName(cc.Sprite).spriteFrame = this.five_one
                        // console.log(children.name);

                    } else if (children.name == 'i8') {
                        // ModSet.fnSpriteFrame(children, '/resources/texturse/icon/9_1.png');
                        children.getChildByName(cc.Sprite).spriteFrame = this.nine_one

                        // console.log(children.name);
                    }
                });
            })

        }

    },

    // 点击自动游戏面板的开启 或 直接点击关闭自动游戏
    fnAutoBtn: function () {
        // console.log('点击了自动游戏按钮');
        if (conf.user == null || conf.user.scene == '') {
            console.log('游戏错误，请退出游戏后重试');
            return
        }

        console.log('前前前前前前', conf.autoState)
        conf.autoState = !conf.autoState;
        console.log('后后后后后后', conf.autoState)

        // 自动按钮底色
        cc.find('Canvas/MainPart/buttonBox/auto/autoTrue').active = conf.autoState
        cc.find('Canvas/MainPart/buttonBox/auto/btn').active = !conf.autoState
        
        // 自动按钮上下
        var autoBtAnm = cc.find('Canvas/MainPart/buttonBox/auto/bg').getComponent(cc.Animation);
        autoBtAnm.play(conf.autoState ? 'autoToTop' : 'autoToBottom');

        let autoBtn = cc.find('Canvas/MainPart/buttonBox/auto');

        if (conf.autoState === true) { // 点完开启关闭弹窗
            this.fnOpenOrClose(-1, 'autoGame');
        }
        
        // prentActive = autoBtn.getChildByName('autoTrue');
        // prentActive.node.active = !prentActive.node.active;

        // autoBtn.getChildByName('btn').getChildByName('bg').active = !autoBtn.getChildByName('btn').getChildByName('bg').active;
        // autoBtn.getChildByName('btn').getChildByName('str').active = !autoBtn.getChildByName('btn').getChildByName('str').active;
        
        conf.k = 0;
        this.fnStr(autoBtn.getChildByName('btn').getChildByName('str'), conf.autoNumber - 1)
        if (conf.user.free > 0) {
            conf.gloGame.fnPlay()
        } else if (conf.autoState) {
            conf.gloGame.fnPlay()
        }

        // console.log(conf.gloGame.fnplay);
    },
    fnHelpBtn: function () {

    },
    // 原来返回大厅
    fnbackBtn: function () {
        this.fnTips('是否退出到大厅');
    },
    fnsettingAutoNumBtn: function (e) {
        conf.autoNumber = (e.progress == 0 ? 1 : parseInt(parseFloat(e.progress) * conf.autoInitNumber));
        // this.fnStr(e.node.getChildByName('Handle').getChildByName('str'), conf.autoNumber)
        this.freeSliderNum.string = conf.autoNumber
        if (this.freeSliderNum.string == '0') {
            this.freeSliderNum.string = 1
        }
    },
    fnaddButton: function (e) {
        conf.user.bet_score = Number(conf.user.bet_score);
        if (conf.user.bet_score == 500) {
            this.fnTips('已是最大投注金额!')
            return
        }

        conf.gloGame.fnStr(e.target.parent.getChildByName('str'), conf.user.bet_score += conf.bet);
        // cc.log(' =====A ', conf.user.bet_score)
        // cc.log(' =====B ', conf.bet)
        this.fnSetting();

    },
    fnminusButton: function (e) {
        conf.user.bet_score = Number(conf.user.bet_score)

        conf.gloGame.fnStr(e.target.parent.getChildByName('str'), conf.user.bet_score = conf.user.bet_score - conf.bet > 0 ? conf.user.bet_score -= conf.bet : conf.user.bet_score)
        this.fnSetting();
    },
    fnSetting: function () {
        // *************************** william
        // pim.ajax({
        //     method: 'POST', async: true, data: { bet_score: conf.user.bet_score, auto_play: conf.user.auto_play },
        //     url: conf.url + '/game/setting', success: (data) => {
        //         // console.log(data)
        //         if ((JSON.parse(data)).msg.indexOf('设置成功') == -1) {
        //             // conf.gloGame.fnInfo('投注失败！');
        //             return;
        //         }
        //         // conf.gloGame.fnInfo('投注成功！')
        //     }
        // })
        // *************************** william
        HTTP.post('/game/setting', {token: conf.token, bet_score: conf.user.bet_score, auto_play: conf.user.auto_play }, function (err, data) {
            if (data.code != 0) {
                console.log(' ****** /game/setting XXXX')
                return
            }
            if (err) {
                console.log(err)
                return
            }
            console.log(data)
            if (data.msg.indexOf('设置成功') == -1) {
                // conf.gloGame.fnInfo('投注失败！')
                return
            }
            // conf.gloGame.fnInfo('投注成功！')
        }.bind(this))


    },
    fnStr: function (node, str) {
        node.getComponent(cc.Label).string = str;
    },
    fnPageUp: (e) => {
        ModSet.fnPaging(cc.find('Canvas/popover/helpBox/PageView'), false)
    },
    fnPageDown: (e) => {
        ModSet.fnPaging(cc.find('Canvas/popover/helpBox/PageView'), true)
    },
    fnAudioState: function (e) {
        // console.log(e);
        // console.log( e==undefined?cc.find('Canvas/popover/settingBox/audio/sprite'):e.target);

        // let target = e==undefined?false:e.target || cc.find('Canvas/popover/settingBox/audio/sprite');
        let target = e == undefined ? cc.find('Canvas/popover/settingBox/audio/sprite') : e.target;
        var btn = target.getChildByName('btn'), btn_width = 0;

        // 判断是否是第一次点击声音按钮
        if (!conf.isOne) {
            conf.audioState = !conf.audioState;
            cc.sys.localStorage.setItem('audioState', conf.audioState);
            console.log('conf.audioState', conf.audioState);
        }

        if (conf.audioState) {
            btn_width = 22;
            conf.volume = 0.7;
        } else {
            btn_width = -22;
            conf.volume = 0;
        }

        // 刷新音量条
        this.volumnSlider.progress = conf.volume;
        // 刷新音量文字显示
        this.audioStr.string = parseInt(conf.volume * 100)   + '%';
        
        cc.audioEngine.setVolume(conf.gloGame.bgNode, conf.volume);

        btn.runAction(cc.sequence(cc.moveTo(0.3, btn_width, btn.y), cc.callFunc(function () {
            conf.isOne = false;

        })))
        // if (conf.audioState) {
        conf.gloGame.audioBox.children.forEach(item => {
            item.getComponent(cc.AudioSource).mute = conf.audioState;
            // console.log(item.getComponent(cc.AudioSource).mute);

        });
        // } else {

        // }
    },
    fnClickChests: function (e) {
        // ************************************** william
        // pim.ajax({
        //     method: 'POST', async: true,
        //     url: conf.url + '/game/luky', success: (data) => {
        //         conf.luky = (JSON.parse(data)).data;
        //         console.log((JSON.parse(data)));

        //         if ((JSON.parse(data)).msg.indexOf('抽奖成功') == -1) {
        //             conf.gloGame.fnInfo('抽奖失败，请重新进入游戏！')
        //             return;
        //         }
        //         conf.user = conf.luky.user

        //         let node = e.target;
        //         var chestsMoveTop = cc.moveTo(1, 0, 300), anim = node.getComponent(cc.Animation);
        //         let callfn = cc.callFunc(function (target) {

        //             this.fnStr(cc.find('Canvas/popover/winningBox/str'), conf.luky.total_score + "金币");
        //             this.init();

        //             this.fnOpenOrClose('1', 'winningBox');


        //         }, this)
        //         // 停止宝箱摇动动画
        //         anim.stop('chests');
        //         // 播放宝箱音乐
        //         cc.audioEngine.play(this.audioChests, false, conf.volume)
        //         conf.chests.DCDST = node;
        //         conf.chests.historyPosition = node.getPosition();
        //         // console.log(conf.chests.historyPosition)
        //         let sequence = cc.sequence(callfn, cc.spawn(cc.scaleTo(0.5, 2, 2), cc.moveTo(0.5, 0, 280)));
        //         node.runAction(sequence);
        //         anim.play('openChests');
        //         node.getComponent(cc.Button).interactable = false;
        //     }

        // })
        // this.fnOpenOrClose(-1,'winningBox');

        // ************************************** william
        HTTP.post('/game/luky', {token: conf.token}, function (err, data) {
            if (data.code != 0) {
                console.log(' ****** /game/luky XXXX')
                return
            }
            if (err) {
                console.log(err)
                return
            }
            conf.luky = data.data;
            console.log(data);

            if (data.msg.indexOf('抽奖成功') == -1) {
                conf.gloGame.fnInfo('抽奖失败，请重新进入游戏！')
                return;
            }
            conf.user = conf.luky.user

            let node = e.target;
            var chestsMoveTop = cc.moveTo(1, 0, 300), anim = node.getComponent(cc.Animation);
            let callfn = cc.callFunc(function (target) {
                if (conf.luky.total_score == 0) {
                    this.box_title_node.spriteFrame = this.box_lose
                } else {
                    this.box_title_node.spriteFrame = this.box_win
                }

                this.fnStr(cc.find('Canvas/popover/winningBox/str'), conf.luky.total_score + "金币");
                this.init();

                this.fnOpenOrClose('1', 'winningBox');


            }, this)
            // 停止宝箱摇动动画
            anim.stop('chests');
            // 播放宝箱音乐
            cc.audioEngine.play(this.audioChests, false, conf.volume)
            conf.chests.DCDST = node;
            conf.chests.historyPosition = node.getPosition();
            // console.log(conf.chests.historyPosition)
            let sequence = cc.sequence(callfn, cc.spawn(cc.scaleTo(0.5, 2, 2), cc.moveTo(0.5, 0, 280)));
            node.runAction(sequence);
            anim.play('openChests');
            node.getComponent(cc.Button).interactable = false;
        }.bind(this))
    },
    // 退出游戏
    fnExitGame() {
        cc.find('Canvas/pulldown/xialakuang').active = false
        cc.find('Canvas/pulldown/splash').active = false
        
        // 取消掉所有的计时器
        clearTimeout(this.clock1)
        clearTimeout(this.clock2)
        clearTimeout(this.clock3)
        clearTimeout(this.clock4)
        clearTimeout(this.clock5)
        clearTimeout(this.clock6)
        clearTimeout(this.clock7)
        
        this.unscheduleAllCallbacks()

        cc.INGAME = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + "ALLGame/laBa9/"
        cc.getout = null
        window.require(cc.INGAME + "src/dating.js")
    },

    // 用于开启或关闭模态框
    fnOpenOrClose: (e, clickDate) => {
        cc.find('Canvas/pulldown/xialakuang').active = false
        cc.find('Canvas/pulldown/splash').active = false
        console.log(' %%%% ', cc.find('Canvas/pulldown/splash').active)

        if (clickDate == 'autoGame') {
            cc.log('MMM', conf.gloGame.playBtn.getComponent(cc.Button).interactable)
            if (!conf.gloGame.playBtn.getComponent(cc.Button).interactable && !conf.autoState) {
                console.log('当前游戏按钮为false, 非法操作');
                return;
            }
        }

        let popover = cc.find('Canvas/popover'),
        clickDateBox = cc.find('Canvas/popover/' + clickDate);

        clickDateBox.active = !clickDateBox.active;

        if (e === '1' && clickDate === 'winningBox') {
            _this.scheduleOnce(function() {
                this.fnCloseChests();
            }, 2);
        }

        // popover.getChildByName('blockInputEvents').active = !popover.getChildByName('blockInputEvents').active

        // conf.gloGame.fnScaleTo(popover)
        // if (clickDate=='helpBox') {
        //     ModSet.fnPaging(cc.find('Canvas/popover/helpBox/PageView'),null,0)
        // }

        popover.getChildByName('blockInputEvents').active = !popover.getChildByName('blockInputEvents').active
    },

    // william 弹窗管理
    on_box_manager: function (e, data) {
        switch (data) {
            case 'set_1': // 打开设置
                cc.find('Canvas/popover/blockInputEvents').active = true
                cc.find('Canvas/popover/settingBox').active = true
                break
            case 'set_-1': // 关闭设置
                cc.find('Canvas/popover/blockInputEvents').active = false
                cc.find('Canvas/popover/settingBox').active = false
                break
            case 'help_1': // 打开帮助
                cc.find('Canvas/pulldown/xialakuang').active = false
                cc.find('Canvas/pulldown/splash').active = false
                cc.find('Canvas/popover/blockInputEvents').active = true
                cc.find('Canvas/popover/helpBox').active = true
                break
            case 'help_-1': // 关闭帮助
                cc.find('Canvas/pulldown/xialakuang').active = false
                cc.find('Canvas/pulldown/splash').active = false
                cc.find('Canvas/popover/blockInputEvents').active = false
                cc.find('Canvas/popover/helpBox').active = false
                break
            default:
                this.fnTips('操作有误')
        }
    },

    // 用来给提示框传送数据
    fnTips: function (str1, str2) {
        str2 = str2 || '';
        let otipsBox = cc.find('Canvas/popover/tipsBox');
        otipsBox.getChildByName('tipsTitle').getComponent(cc.Label).string = str1;
        otipsBox.getChildByName('tipsStr').getComponent(cc.Label).string = str2;
        this.fnOpenOrClose(-1, 'tipsBox');
    },
    // 关闭中奖通知
    fnCloseChests: function (e) {

        let callfn = cc.callFunc(function (target) {
            this.fnOpenOrClose(-1, 'winningBox');
            if (conf.user.luky == 0) {
                this.oChestsBox.active = false;
                let aSudokuList = conf.oSudoku.getChildByName('markBox').children;
                conf.gloGame.playBtn.getComponent(cc.Button).interactable = true;
                // ModSet.fnSpriteFrame(conf.gloGame.playBtn, '/resources/texturse/game/play.png');
                this.playBtn.spriteFrame = this.play_frame[0]
            }
        }, this)
        let sequence = cc.sequence(cc.spawn(cc.scaleTo(0.5, 0.9, 0.9), cc.moveTo(0.5, conf.chests.historyPosition.x, conf.chests.historyPosition.y)), callfn);
        conf.chests.DCDST.runAction(sequence);

        if (conf.autoState && conf.user.luky == 0) {
            this.clock7 = setTimeout(conf.gloGame.fncallBack, 2000)

        }
    },

    // 缩放节点的动画
    fnScaleTo: function (target) {

        var boon = target.scaleX == 1 && target.scaleY == 1 ? true : false,
            x = boon ? 0 : 1,
            y = boon ? 0 : 1,
            callHelp = cc.callFunc(function () {
                ModSet.fnPaging(cc.find('Canvas/popover/helpBox/PageView'), null, 0)

            });
        if (boon == false) {

        }
        target.runAction(cc.sequence(cc.scaleTo(0.3, x, y), callHelp));

    },
    // 游戏信息
    fnInfo: function (str) {
        this.fnStr(this.info.getChildByName('str'), str);
        this.info.runAction(cc.sequence(cc.fadeIn(0.3), cc.delayTime(0.5), cc.fadeOut(0.3)))
    },
    // 自动游戏
    fnAutoGame: function () {
        // 打开自动游戏弹框
        this.fnOpenOrClose(-1, 'autoGame');

        // let autoBox = cc.find('Canvas/popover/autoGame');
        // autoBox.getChildByName('autoTitle').getComponent(cc.Label).string = str1;
        // autoBox.getChildByName('autoStr').getComponent(cc.Label).string = str2;
    },
    // 音量板
    fnAudioShow: function () {
        this.audioBlock.active = !this.audioBlock.active;
    },
    // 音量
    fnAudioVolumn: function (sender, e) {
        // 一旦点击了音量条
        conf.audioState = true
        cc.sys.localStorage.setItem('audioState', conf.audioState)

        var btn = cc.find('Canvas/popover/settingBox/audio/sprite/btn')
        var btn_w = 22
        btn.setPosition(cc.v2(22, btn.y))
        
        cc.audioEngine.setVolume(conf.gloGame.bgNode, sender.progress);
        conf.volume = sender.progress;
        this.audioStr.string = parseInt(conf.volume * 100) + '%';
    },
    // tset
    on_test: function () {
        console.log('xx')
    },
    
    // 打开战绩
    on_game_record_mgr: function (event, data) {
        if (data === '1') {
            this.game_record_node.active = true
            cc.find('Canvas/pulldown/xialakuang').active = false
            cc.find('Canvas/pulldown/splash').active = false
        } else {
            this.game_record_node.active = false
        }
        
    },

    // 去大厅商城
    on_goto_dating_hall: function () {
        cc.log('去大厅商城')
    },
    
    // test
    on_Stop: function () {
        // 取消掉所有的计时器
        // this.unscheduleAllCallbacks()
        clearTimeout(this.clock1)
        clearTimeout(this.clock2)
        clearTimeout(this.clock3)
        clearTimeout(this.clock4)
        clearTimeout(this.clock5)
        clearTimeout(this.clock6)
        clearTimeout(this.clock7)

    }
});
