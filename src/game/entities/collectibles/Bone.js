var Bone = Collectible.extend({

    _addFixtures: function() {
        var width = this.node.getContentSize().width * 1.2;
        this._addCircularFixture(width / 2);
    },

    init: function(b2world, properties) {

        this.node = cc.Sprite.createWithSpriteFrameName("bone.png");
        this.type = GameObjectType.Bone;

        this._super(b2world, properties);

    }

});