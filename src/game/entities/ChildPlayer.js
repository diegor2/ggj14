var ChildPlayer = Player.extend({

    init: function(b2world, properties) {

        this._spriteFrameName   = "child";

        this._idleFrameName     = "_idle";
        this._runningFrameName  = "_run";
        this._attackFrameName   = "_attack";
        this._damageFrameName   = "_hit";

        this._idleFrameCount    = 2;
        this._runningFrameCount = 4;
        this._attackFrameCount  = 1;
        this._damageFrameCount  = 1;

        this.node = cc.Sprite.createWithSpriteFrameName(this._spriteFrameName + this._idleFrameName + "_1.png");

        this._super(b2world, properties);

        this.node.setAnchorPoint(cc.p(0.5, 0.04));

    }

});