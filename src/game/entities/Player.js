
var Player = Actor.extend({

    _addFixtures: function() {

        var width = this.node ? this.node.getContentSize().width * 0.25 : 0;

        this._addCircularFixture(width);

        var scale = this.node ? this.node.getScale() : 1;
        var hitAreaRadius = width * 2.6;
        var hitAreaMargin = hitAreaRadius;

        var damageShape = new b2CircleShape;
        damageShape.set_m_radius(width * scale / PTM_RATIO);

        var leftSensorShape = new b2CircleShape;
        leftSensorShape.set_m_radius(hitAreaRadius * scale / PTM_RATIO);
        leftSensorShape.set_m_p(new b2Vec2(-hitAreaMargin / PTM_RATIO, 0));

        var rightSensorShape = new b2CircleShape;
        rightSensorShape.set_m_radius(hitAreaRadius * scale / PTM_RATIO);
        rightSensorShape.set_m_p(new b2Vec2(hitAreaMargin / PTM_RATIO, 0));

        var damageArea = new ContactContainer;
        damageArea.type = ContactType.DamageArea;

        var leftHitArea = new ContactContainer;
        leftHitArea.type = ContactType.LeftHitArea;
    
        var rightHitArea = new ContactContainer;
        rightHitArea.type = ContactType.RightHitArea;

        this._createSensorFixture(damageShape, damageArea);
        this._createSensorFixture(leftSensorShape, leftHitArea);
        this._createSensorFixture(rightSensorShape, rightHitArea);
    
    },
    
    init: function(b2world, properties) {

        this.type = GameObjectType.Player;
        this.life = kPlayerMaxLife;

        this._super(b2world, properties);

        this.node.setAnchorPoint(cc.p(0.5, 0.04));

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