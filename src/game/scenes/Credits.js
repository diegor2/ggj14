
var Credits = BaseLayer.extend({

    _buttonBPressed: false,

    init: function() {
        this._super();

        //var winSize = cc.Director.getInstance().getWinSize();
        var titleItem = cc.MenuItemLabel.create(cc.LabelBMFont.create("Back", fnt_Dialogue, 170, cc.TEXT_ALIGNMENT_CENTER), this._goToTitle, this);

        var menu = cc.Menu.create(titleItem);

        menu.alignItemsVerticallyWithPadding(10);
        menu.setPosition(cc.p(80, 40));

        this.addChild(menu);

    },

    buttonB: function(pressed) {

        if (!pressed) {
            this._buttonBPressed = false;
            return;
        }

        if (this._buttonBPressed)
            return;
        this._buttonBPressed = true;

        this._goToTitle();

    },

    _goToTitle: function() {
        cc.Director.getInstance().replaceScene(new TitleScene());
    }

});

var CreditsScene = cc.Scene.extend({

    onEnter: function () {
        this._super();
        var layer = new Credits();
        layer.init();
        this.addChild(layer);
    }

});