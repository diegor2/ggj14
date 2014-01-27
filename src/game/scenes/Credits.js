
var Credits = BaseLayer.extend({

    _buttonBPressed: false,

    init: function() {
        this._super();

        var winSize = cc.Director.getInstance().getWinSize();
        var titleItem = cc.MenuItemLabel.create(cc.LabelBMFont.create("Back", fnt_Dialogue, 170, cc.TEXT_ALIGNMENT_CENTER), this._goToTitle, this);

        var bg = cc.Sprite.create(img_Stage4Bg);
        bg.setAnchorPoint(cc.p(0, 0));

        var menu = cc.Menu.create(titleItem);

        menu.alignItemsVerticallyWithPadding(10);
        menu.setPosition(cc.p(80, 40));

        var titleLabel = cc.LabelBMFont.create("CREDITS", fnt_Dialogue, winSize.width, cc.TEXT_ALIGNMENT_CENTER);
        titleLabel.setPosition(cc.p(winSize.width / 2, winSize.height * 0.8));
        titleLabel.setColor(cc.c3b(200, 200, 200));

        var codeLabel = cc.LabelBMFont.create("Alison Ramos\nBruno Assarisse\nDiego Ruggeri\nGustavo Ravagnani\nLuana Favetta\nMarcelo Raza", fnt_Dialogue, 400, cc.TEXT_ALIGNMENT_LEFT);
        codeLabel.setPosition(cc.p(winSize.width * 0.75, winSize.height / 2));
        codeLabel.setColor(cc.c3b(200, 200, 200));

        this.addChild(bg);
        this.addChild(titleLabel);
        this.addChild(codeLabel);
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