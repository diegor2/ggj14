
var Enemy = Actor.extend({

    player: null,
	GameObjectState: GameObjectState.Defence,
	
    _addFixtures: function() {

        var width = this.node ? this.node.getContentSize().width * 0.1 : 0;

        this._addCircularFixture(width);

        var scale = this.node ? this.node.getScale() : 1;
        var hitAreaRadius = width * 4;
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

        this._spriteFrameName   = "child";
        this._idleFrameName     = "_idle";
        this._runningFrameName  = "_run";
        this._attackFrameName    = "_attack";
        this._damageFrameName   = "_hit";

        this._idleFrameCount    = 2;
        this._runningFrameCount = 4;
        this._attackFrameCount   = 1;
        this._damageFrameCount  = 1;

        this.node = cc.Sprite.createWithSpriteFrameName(this._spriteFrameName + this._idleFrameName + "_1.png");
        this.type = GameObjectType.Enemy;
        this.life = kEnemyMaxLife;

        this._super(b2world, properties);

    },

    _setProperties: function(properties) {
        this._super(properties);

    },

    update: function(delta) {

        this.reactToPlayer();
        this._checkAttackOnType(Player);

        this._super(delta);

    },

    handleCollision: function(contactContainer) {

    },
    
    reactToPlayer: function () {

		var myPosition = this.b2body.GetPosition();
		var playerPosition = this.player.b2body.GetPosition();
        var distanceX = myPosition.get_x() - playerPosition.get_x();
        var distanceY = myPosition.get_y() - playerPosition.get_y();
        var distance = Math.sqrt(distanceX * distanceX, distanceY * distanceY);

        if((Math.abs(distance) < kEnemyPeacefulDistance)
            && (this.player.state != GameObjectState.Dead)) {

            if(Math.abs(distance) < kEnemyAtackDistance ) {
                this.attack();
            }

            if (GameObjectState.Attack == this.GameObjectState) {
                this.horizontalMovingState = (distanceX > 0) ? MovingState.Left : MovingState.Right;
                this.verticalMovingState = (distanceY < 0) ? MovingState.Up: MovingState.Down;
            } else {
                this.GameObjectState = GameObjectState.Attack;
            }

        } else {
            if (GameObjectState.Attack == this.GameObjectState) {
                this.GameObjectState = GameObjectState.Standing;
                this.horizontalMovingState = MovingState.Stopped;
                this.verticalMovingState = MovingState.Stopped;
            }
        }


    }

});