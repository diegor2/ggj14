
var Enemy = Actor.extend({

    player: null,
	enemyState: GameObjectState.Standing,
    _attackCurrentWaitTime: 0,
    _attackWaitTime: 0,
	
    _addFixtures: function() {

        var width = this.node ? this.node.getContentSize().width * 0.19 : 0;

        this._addCircularFixture(width);

        var scale = this.node ? this.node.getScale() : 1;
        var hitAreaRadius = width * 3.3;
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

        this._attackWaitTime = -1;
        this._walkForceModifier = 0.5;

        this.type = GameObjectType.Enemy;
        this.life = kEnemyMaxLife;

        this._super(b2world, properties);

    },

    _setProperties: function(properties) {
        this._super(properties);

    },

    update: function(delta) {

        if (this._attackWaitTime > -1) {
            this._attackCurrentWaitTime += delta;
            if (this._attackCurrentWaitTime > this._attackWaitTime) {
                this.attack();
                this._attackWaitTime = -1;
            }
        } else {
            this.reactToPlayer();
        }

        this._checkAttackOnType(Player);

        this._super(delta);

    },

    _triggerAttack: function() {
        this.horizontalMovingState = MovingState.Stopped;
        this.verticalMovingState = MovingState.Stopped;
        this._attackCurrentWaitTime = 0;
        this._attackWaitTime = Math.random();
    },

    handleCollision: function(contactContainer) {

    },
    
    reactToPlayer: function () {

        if (this.state != GameObjectState.Standing)
            return;

		var myPosition = this.b2body.GetPosition();
		var playerPosition = this.player.b2body.GetPosition();
        var distanceX = myPosition.get_x() - playerPosition.get_x();
        var distanceY = myPosition.get_y() - playerPosition.get_y();
        var distance = Math.sqrt(distanceX * distanceX, distanceY * distanceY);

        if ((Math.abs(distance) < kEnemyPeacefulDistance)
            && (this.player.state != GameObjectState.Dead && this.player.state != GameObjectState.Dying)) {

            if (Math.abs(distance) < kEnemyAttackDistance) {
                this._triggerAttack();
                return;
            }

            if (GameObjectState.Attack == this.enemyState) {
                this.horizontalMovingState = (distanceX > 0) ? MovingState.Left : MovingState.Right;
                this.verticalMovingState = (distanceY < 0) ? MovingState.Up: MovingState.Down;
            } else {
                this.enemyState = GameObjectState.Attack;
            }

        } else {
            if (GameObjectState.Attack == this.enemyState) {
                this.enemyState = GameObjectState.Standing;
                this.horizontalMovingState = MovingState.Stopped;
                this.verticalMovingState = MovingState.Stopped;
            }
        }

    },

    takeHit: function() {

        this._super();

        this._attackCurrentWaitTime = 0;
        this._attackWaitTime = -1;

    }

});