var HUDLayer = cc.Layer.extend({

    _player: null,
    _lifeHalfs: null,
    _lifePreviousValue: -1,

    init: function(player) {

        this._player = player;

        var winSize = cc.Director.getInstance().getWinSize();
        var batchNode = cc.SpriteBatchNode.create(img_Chars);

        this._lifeHalfs = [];

        for (var i = 0; i < kPlayerMaxLife; i++) {

            var lifeImage = cc.Sprite.createWithSpriteFrameName("bone.png");
            var imageWidth = lifeImage.getContentSize().width;

            lifeImage.setAnchorPoint(cc.p(0, 1));
            lifeImage.setPosition(cc.p(3 + i * imageWidth + Math.floor(i / 2) * 3, winSize.height - 3));

            batchNode.addChild(lifeImage);
            this._lifeHalfs.push(lifeImage);

        }

        this.addChild(batchNode);

    },

    update: function(delta) {

        var playerLife = this._player.life;

        var lifeChanged = this._lifePreviousValue != playerLife;

        this._lifePreviousValue = playerLife;

        if (lifeChanged) {

            for (var i = 0; i < kPlayerMaxLife; i++) {

                var lifeImage = this._lifeHalfs[i];
                lifeImage.setOpacity(i < playerLife ? 255 : 100);

            }

        }

    }

});