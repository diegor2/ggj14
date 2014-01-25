var Collectible = GameObject.extend({

    _isSensor: true,

    _addFixtures: function() {
        var width = this.node.getContentSize().width * 1;
        this._addCircularFixture(width / 2);
    },

    init: function(b2world, properties) {
        this._super(b2world, properties);

        this.b2body.SetGravityScale(0);

        var action = cc.Sequence.create(
            cc.EaseInOut.create(cc.MoveBy.create(1.2, cc.p(0, 6)), 1.5),
            cc.EaseInOut.create(cc.MoveBy.create(1.2, cc.p(0, -6)), 1.5)
        );

        this.node.setPositionY(this.node.getPositionY() - 3);
        this.node.runAction(cc.RepeatForever.create(action));
    }

});