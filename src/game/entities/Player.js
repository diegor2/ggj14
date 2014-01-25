
var Player = Actor.extend({

    cookies: 0,
    bones: 0,
    didHit: false,

    _addFixtures: function() {

        var width = this.node.getContentSize().width * 0.2;
        var height = this.node.getContentSize().height * 0.35;
        var y = -(this.node.getContentSize().height * 0.25);

        this._addRectangularFixture(width, height, 0, y);
    
        var basicSensorWidth = (width * 0.9 * this.node.getScale()) / PTM_RATIO;
        var basicSensorY = (height / 2 * this.node.getScale()) / PTM_RATIO;

        //foot sensor shape
        var footSensorShape = new b2PolygonShape;
        footSensorShape.SetAsBox(basicSensorWidth / 2, 0.015, new b2Vec2(0, y * this.node.getScale() / PTM_RATIO - basicSensorY), 0);
    
        //foot sensor shape
        var headSensorShape = new b2PolygonShape;
        headSensorShape.SetAsBox(basicSensorWidth / 2, 0.015, new b2Vec2(0, y * this.node.getScale() / PTM_RATIO + basicSensorY), 0);
    
        var footContact = new ContactContainer;
        footContact.type = ContactType.Foot;
    
        var headContact = new ContactContainer;
        headContact.type = ContactType.Head;

        this._createSensorFixture(footSensorShape, footContact);
        this._createSensorFixture(headSensorShape, headContact);
    
    },
    
    init: function(b2world, properties) {

        this.node = cc.Sprite.createWithSpriteFrameName("dog_idle_1.png");
        this._spriteFrameName = "dog";
        this.type = GameObjectType.Player;

        this._super(b2world, properties);

    },

    update: function(delta) {
        this._super(delta);

        this._damageTime -= delta;
        if (this._damageTime < 0)
            this._damageTime = 0;

    },

    handleCollisionWithGameObject: function(gameObject) {

        switch (gameObject.type) {

            case GameObjectType.Enemy:

                if (this._damageTime > 0)
                    return;
                this._damageTime = kPlayerDamageTime;
                this.didHit = true;

                var throwToLeft = gameObject.b2body.GetPosition().get_x() > this.b2body.GetPosition().get_x();
                var impulse = new b2Vec2(throwToLeft ? -kPlayerDamageImpulseX : kPlayerDamageImpulseX, kPlayerDamageImpulseY);

                this.b2body.SetLinearVelocity(new b2Vec2(0, 0));
                this.b2body.ApplyLinearImpulse(impulse, this.b2body.GetWorldCenter());

                break;

            case GameObjectType.LevelEnd:
                gameObject.die();
                this.stage.end();
                break;

        }

    }

});