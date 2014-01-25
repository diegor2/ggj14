
var Enemy = Actor.extend({

    _walkForceModifier: 1,
    _directionChangeTime: kEnemyDirectionChangeTime,
    _directionChangeIdleTime: 0,
    _directionChangeMaxIdleTime: 0,
    _lastMovingState: MovingState.Right,
    player: null,

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

        this.node = cc.Sprite.createWithSpriteFrameName("dog2_idle_1.png");
        this._spriteFrameName = "dog2";
        this.type = GameObjectType.Enemy;

        this._super(b2world, properties);

    },

    _setProperties: function(properties) {
        this._super(properties);

        var pDirection = properties["direction"];
        var pSpeed = properties["speed"];
        var pIdleTime = properties["idleTime"];

        this.movingState = pDirection == "left" ? MovingState.Left : MovingState.Right;

        if (pSpeed)
            this._walkForceModifier = parseFloat(pSpeed);
        if (pIdleTime)
            this._directionChangeMaxIdleTime = parseFloat(pIdleTime);

    },

    _changeDirection: function(idleTime) {

        var directionMovingState = this.movingState == MovingState.Stopped ? this._lastMovingState : this.movingState;

        if (idleTime <= 0)
            this.movingState = directionMovingState == MovingState.Right ? MovingState.Left : MovingState.Right;
        else {
            this._lastMovingState = directionMovingState;
            this.movingState = MovingState.Stopped;
        }
        this._directionChangeTime = kEnemyDirectionChangeTime;
        this._directionChangeIdleTime = idleTime;

    },

    update: function(delta) {

        if (this._directionChangeIdleTime > 0)
            this._directionChangeIdleTime -= delta;

        if (this._directionChangeTime <= 0 && this._directionChangeIdleTime <= 0) {

            var velX = this.b2body.GetLinearVelocity().get_x();
            var margin = 1 * this._walkForceModifier;

            if (velX > -margin && velX < margin)
                this._changeDirection(this.movingState == MovingState.Stopped ? 0 : this._directionChangeMaxIdleTime);

        } else {
            this._directionChangeTime -= delta;
        }

        this._super(delta);

    },

    handleCollision: function(contactContainer) {

    },

    takeHit: function(direction) {

        if (this._damageTime > 0)
            return;
        this._damageTime = kPlayerDamageTime;

        this._life--;

        if (this._life <= 0)
            this.die();

        var impulse = new b2Vec2(direction == MovingState.Right ? kPlayerDamageImpulseX : -kPlayerDamageImpulseX, 0);

        this.b2body.SetLinearVelocity(new b2Vec2(0, 0));
        this.b2body.ApplyLinearImpulse(impulse, this.b2body.GetWorldCenter());

    }

});