
var Player = Actor.extend({

    _addFixtures: function() {

        var width = this.node.getContentSize().width * 0.1;

        this._addCircularFixture(width);

        var scale = this.node ? this.node.getScale() : 1;
        var hitAreaRadius = width * 4;
        var hitAreaMargin = hitAreaRadius;

        var leftSensorShape = new b2CircleShape;
        leftSensorShape.set_m_radius(hitAreaRadius * scale / PTM_RATIO);
        leftSensorShape.set_m_p(new b2Vec2(-hitAreaMargin / PTM_RATIO, 0));

        var rightSensorShape = new b2CircleShape;
        rightSensorShape.set_m_radius(hitAreaRadius * scale / PTM_RATIO);
        rightSensorShape.set_m_p(new b2Vec2(hitAreaMargin / PTM_RATIO, 0));
    
        var leftHitArea = new ContactContainer;
        leftHitArea.type = ContactType.LeftHitArea;
    
        var rightHitArea = new ContactContainer;
        rightHitArea.type = ContactType.RightHitArea;

        this._createSensorFixture(leftSensorShape, leftHitArea);
        this._createSensorFixture(rightSensorShape, rightHitArea);
    
    },
    
    init: function(b2world, properties) {

        this.node = cc.Sprite.createWithSpriteFrameName("dog_idle_1.png");
        this._spriteFrameName = "dog";
        this.type = GameObjectType.Player;
        this.life = kPlayerMaxLife;

        this._super(b2world, properties);

    },

    update: function(delta) {
        this._super(delta);

        this._checkAttackOnType(Enemy);

    },

    handleCollisionWithGameObject: function(gameObject) {

        switch (gameObject.type) {

            case GameObjectType.LevelEnd:
                gameObject.die();
                this.stage.end();
                break;

        }

    }

});