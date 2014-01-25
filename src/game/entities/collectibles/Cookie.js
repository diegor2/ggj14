var Cookie = Collectible.extend({

    init: function(b2world, properties) {

        this.node = cc.Sprite.createWithSpriteFrameName("cookie.png");
        this.type = GameObjectType.Cookie;

        this._super(b2world, properties);

    }

});