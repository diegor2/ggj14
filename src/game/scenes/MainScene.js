
var MainScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        cc.Director.getInstance().replaceScene(new StageScene(1));
    }
});