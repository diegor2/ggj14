
var Enemy = Actor.extend({

    player: null,
	enemyState: EnemyState.Defence,
	
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

    },

    update: function(delta) {

        this.reactToPlayer();

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

    },
    
    reactToPlayer: function () {

		var myPosition = this.b2body.GetPosition();
		var playerPosition = this.player.b2body.GetPosition();
        var distanceX = myPosition.get_x() - playerPosition.get_x();
        var distanceY = myPosition.get_y() - playerPosition.get_y();
        var distance = Math.sqrt(distanceX * distanceX, distanceY * distanceY);

        if(Math.abs(distance) < kEnemyPeacefulDistance ) {

            switch (this.enemyState) {
                case EnemyState.Defence:
                case EnemyState.Roaming:
                    this.enemyState = EnemyState.Attack;
                    break;
                case EnemyState.Attack:
                    this.horizontalMovingState = (distanceX > 0) ? MovingState.Left : MovingState.Right;
                    this.verticalMovingState = (distanceY < 0) ? MovingState.Up: MovingState.Down;
                    break;
            }

        } else {
            switch (this.enemyState) {
                case EnemyState.Defence:
                case EnemyState.Roaming:
                    break;
                case EnemyState.Attack:
                    this.enemyState = EnemyState.Defence;
                    this.horizontalMovingState = MovingState.Stopped;
                    this.verticalMovingState = MovingState.Stopped;
                    break;
            }
        }
    },

});