
var Enemy = Actor.extend({

    _walkForceModifier: 1,
    _directionChangeTime: kEnemyDirectionChangeTime,
    _directionChangeIdleTime: 0,
    _directionChangeMaxIdleTime: 0,
    _lastMovingState: MovingState.Right,
    player: null,
	enemyState: EnemyState.Defence,
	
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

        this.reactToPlayer();

        this._super(delta);

    },

    handleCollision: function(contactContainer) {

        if (contactContainer.type == ContactType.EnemyLimit && this._directionChangeTime <= 0 && this._directionChangeIdleTime <= 0)
            this._changeDirection(this._directionChangeMaxIdleTime);

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
                    this.horizontalMovingState = (distanceX > 0) ? MovingState.Left : MovingState.Right;
                    this.verticalMovingState = (distanceY > 0) ? MovingState.Up: MovingState.Down;
                    break;
                case EnemyState.Attack:
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
                    break;
            }
        }
    },

});