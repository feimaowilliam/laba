
var MethodSet = {
    /**
      *这是一个用来输出的函数
      *@method fnstr
      * @param {string} str 
      */
    fnstr: function (str) {
        console.log(str);

    },
    /**
   *更换Sprite图片
   *@method fnSpriteFrame
   * @param {Object} target Sprite组件所在的节点
   * @param {String} url 需要更换的图片url
   */
    fnSpriteFrame: function (target, url) {
        target.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(cc.url.raw(url));
    },
    /**
   *给使用上下页的PageView翻页
   *@method fnPaging
   * @param {Object} target PageView组件所在的节点
   * @param {boolean} bol 上一页为false,下一页true
   */
    fnPaging: function (target, bol=null,PageIndex=null) {
        target = target.getComponent(cc.PageView);
        let index = null, length = Object.getOwnPropertyNames(target.getPages()).length - 1;
        if (bol) {
            index = target.getCurrentPageIndex() + 1 >= target.length ? target.length : target.getCurrentPageIndex() + 1;
            // console.log(3);
            
        } else if(bol===false) {
            index = target.getCurrentPageIndex() - 1 <= 0 ? 0 : target.getCurrentPageIndex() - 1;
            // console.log(4);

        }
        index=PageIndex===null?index:PageIndex;
        // console.log(index);
        
        target.scrollToPage(index);
    }

};
module.exports = MethodSet;