var HUDLayer = cc.Layer.extend({

    _player: null,
    _boneContainer: null,
    _boneLabel: null,
    _bonePreviousCount: -1,
    _cookieContainer: null,
    _cookieLabel: null,
    _cookiePreviousCount: -1,

    init: function(player) {

        this._player = player;

        var winSize = cc.Director.getInstance().getWinSize();

        // BONES -------------------------------------------------

        this._boneContainer = cc.Layer.create();

        var boneImage = cc.Sprite.createWithSpriteFrameName("bone.png");
        boneImage.setAnchorPoint(cc.p(0, 1));
        boneImage.setPosition(cc.p(3, winSize.height - 3));

        var boneImageShadow = cc.Sprite.createWithSpriteFrameName("bone.png");
        boneImageShadow.setAnchorPoint(boneImage.getAnchorPoint());
        boneImageShadow.setPosition(cc.pAdd(boneImage.getPosition(), cc.p(1, -1)));
        boneImageShadow.setColor(cc.c3b(0, 0, 0));

        this._boneLabel = cc.LabelBMFont.create("0", fnt_Main, 50, cc.TEXT_ALIGNMENT_LEFT);
        this._boneLabel.setAnchorPoint(cc.p(0, 1));
        this._boneLabel.setPosition(cc.p(21, winSize.height - 8));

        var boneBatchNode = cc.SpriteBatchNode.create(img_Chars);

        boneBatchNode.addChild(boneImageShadow);
        boneBatchNode.addChild(boneImage);
        this._boneContainer.addChild(boneBatchNode);
        this._boneContainer.addChild(this._boneLabel);

        this.addChild(this._boneContainer);

        // COOKIES -------------------------------------------------

        this._cookieContainer = cc.Layer.create();

        var cookieImage = cc.Sprite.createWithSpriteFrameName("cookie.png");
        cookieImage.setAnchorPoint(cc.p(0, 1));
        cookieImage.setPosition(cc.p(40, winSize.height - 2));

        var cookieImageShadow = cc.Sprite.createWithSpriteFrameName("cookie.png");
        cookieImageShadow.setAnchorPoint(cookieImage.getAnchorPoint());
        cookieImageShadow.setPosition(cc.pAdd(cookieImage.getPosition(), cc.p(1, -1)));
        cookieImageShadow.setColor(cc.c3b(0, 0, 0));

        this._cookieLabel = cc.LabelBMFont.create("0", fnt_Main, 50, cc.TEXT_ALIGNMENT_LEFT);
        this._cookieLabel.setAnchorPoint(cc.p(0, 1));
        this._cookieLabel.setPosition(cc.p(56, winSize.height - 8));

        var cookieBatchNode = cc.SpriteBatchNode.create(img_Chars);

        cookieBatchNode.addChild(cookieImageShadow);
        cookieBatchNode.addChild(cookieImage);
        this._cookieContainer.addChild(cookieBatchNode);
        this._cookieContainer.addChild(this._cookieLabel);

        this.addChild(this._cookieContainer);

    },

    update: function(delta) {

        var bonesChanged = this._bonePreviousCount != 0;
        var cookiesChanged = this._cookiePreviousCount != 0;

        this._boneLabel.setString("0");
        this._cookieLabel.setString("0");

        this._bonePreviousCount = 0;
        this._cookiePreviousCount = 0;

        var offset = 30;

        if (bonesChanged) {
            this._boneContainer.stopAllActions();

            var action = cc.Sequence.create(
                cc.MoveTo.create(0.1 * (this._boneContainer.getPositionY() / offset), cc.p(0, 0)),
                cc.DelayTime.create(4),
                cc.MoveTo.create(1, cc.p(0, offset))
            );

            this._boneContainer.runAction(action);
        }

        if (cookiesChanged) {
            this._cookieContainer.stopAllActions();

            var action = cc.Sequence.create(
                cc.MoveTo.create(0.1 * (this._boneContainer.getPositionY() / offset), cc.p(0, 0)),
                cc.DelayTime.create(4),
                cc.MoveTo.create(1, cc.p(0, offset))
            );

            this._cookieContainer.runAction(action);
        }

    }

});