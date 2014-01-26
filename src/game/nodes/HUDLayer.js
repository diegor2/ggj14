var HUDLayer = cc.Layer.extend({

    _player: null,
    _lifeHalfs: null,
    _lifePreviousValue: -1,

    init: function(player, level) {

        this._player = player;

        var winSize = cc.Director.getInstance().getWinSize();
        var batchNode = cc.SpriteBatchNode.create(img_Chars);

        this._lifeHalfs = [];

        if (level > 3)
            level = 3;

        var imageSpace = level == 1 ? 20 : 0;

        for (var i = 0; i < kPlayerMaxLife; i++) {

            var suffix = i % 2 == 0 ? "a" : "b";
            var lifeImage = cc.Sprite.createWithSpriteFrameName("heart_" + level + "_" + suffix + ".png");
            var imageWidth = lifeImage.getContentSize().width;

            lifeImage.setAnchorPoint(cc.p(0, 1));
            lifeImage.setPosition(cc.p(imageSpace + i * imageWidth + Math.floor(i / 2) * imageSpace, winSize.height - 10));

            batchNode.addChild(lifeImage);
            this._lifeHalfs.push(lifeImage);

        }

        this.update(0);
        this.addChild(batchNode);

    },

    update: function(delta) {

        var playerLife = this._player.life;

        var lifeChanged = this._lifePreviousValue != playerLife;

        this._lifePreviousValue = playerLife;

        if (lifeChanged) {

            for (var i = 0; i < kPlayerMaxLife; i++) {

                var lifeImage = this._lifeHalfs[i];
                //lifeImage.setOpacity(i < playerLife ? 255 : 50);
                lifeImage.setColor(i < playerLife ? cc.c3b(255, 255, 255) : cc.c3b(100, 100, 100));

            }

        }

    }

});