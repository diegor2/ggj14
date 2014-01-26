
var Title = BaseLayer.extend({

    _buttonStartPressed: false,

    init: function() {
        this._super();

        var winSize = cc.Director.getInstance().getWinSize();

        cc.SpriteFrameCache.getInstance().addSpriteFrames(plist_Hud);

        var startGameItem = cc.MenuItemSprite.create(cc.Sprite.createWithSpriteFrameName("start_game.png"), cc.Sprite.createWithSpriteFrameName("start_game_hover.png"), this.startGame, this);

        var creditsItem = cc.MenuItemSprite.create(cc.Sprite.createWithSpriteFrameName("credits.png"), cc.Sprite.createWithSpriteFrameName("credits_hover.png"), this.openCredits, this);

        var menu = cc.Menu.create(startGameItem, creditsItem);

        menu.alignItemsVerticallyWithPadding(10);
        menu.setPosition(cc.p(winSize.width / 2, winSize.height / 2));

        this.addChild(menu);

    },

    buttonStart: function(pressed) {

        if (!pressed) {
            this._buttonStartPressed = false;
            return;
        }

        if (this._buttonStartPressed)
            return;
        this._buttonStartPressed = true;

        this.startGame();

    },

    startGame: function() {
        cc.Director.getInstance().replaceScene(new StageScene(1));
    },

    openCredits: function() {
        cc.Director.getInstance().replaceScene(new CreditsScene());
    }

});

var TitleScene = cc.Scene.extend({

    onEnter: function () {
        this._super();
        var layer = new Title();
        layer.init();
        this.addChild(layer);
    }

});