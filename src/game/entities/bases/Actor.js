
var Actor = GameObject.extend({

    // public properties

    smokeBatchNode: null,
    horizontalMovingState: MovingState.Stopped,
    verticalMovingState: MovingState.Stopped,
    automaticMovement: true,
    life: 0,

    // "private" properties

    _walkForceModifier: 1,
    _damageTime: 0,
    _attackTime: 0,
    _attackDelay: 0,

    // "private" methods
    _loadAnimation: function(spriteName, frames, delay) {

        var anim = cc.Animation.create();

        anim.setDelayPerUnit(delay);
        anim.setRestoreOriginalFrame(true);

        for (var i = 1; i <= frames ; i++) {
            var frame = this._spriteCache.getSpriteFrame(spriteName + "_" + i + ".png");
            anim.addSpriteFrame(frame);
        }

        return anim;

    },

    _updateAnimation: function() {

        if (this.state == GameObjectState.Standing && this._attackTime <= 0 && this._damageTime <= 0) {
            if (this.horizontalMovingState == MovingState.Left
                || this.horizontalMovingState == MovingState.Right
                || this.verticalMovingState == MovingState.Up
                || this.verticalMovingState == MovingState.Down
                ) {

                var vel = this.b2body.GetLinearVelocity();
                var velX = Math.abs(vel.get_x());
                var velY = Math.abs(vel.get_y());
                var baseSpeedVal = velX > velY ? velX : velY;
                var speed = Math.abs(baseSpeedVal) * kWalkAnimSpeedFactor;

                var walkAction = this.node.getActionByTag(kWalkActionTag);
                if (!walkAction) {

                    var anim = this._loadAnimation(this._spriteFrameName + this._runningFrameName,
                        this._runningFrameCount,
                        2);

                    walkAction = cc.Speed.create(cc.RepeatForever.create(cc.Animate.create(anim)), speed);
                    walkAction.setTag(kWalkActionTag);
                    this.node.stopAllActions();
                    this.node.runAction(walkAction);

                } else {
                    walkAction.setSpeed(speed);
                }

            } else {
                this._setIdleFrame();
            }
        }
    },

    _setIdleFrame: function() {

        var idleAction = this.node.getActionByTag(kIdleActionTag);

        if (idleAction)
            return;

        var anim = this._loadAnimation(this._spriteFrameName
            + this._idleFrameName, this._idleFrameCount, 0.5);

        idleAction = cc.RepeatForever.create(cc.Animate.create(anim));
        idleAction.setTag(kIdleActionTag);

        this.node.stopAllActions();
        this.node.runAction(idleAction);

    },

    // public methods

    init: function(b2world, properties) {

        this._filterCategory = EntityFilterCategory.Actor;
        this._filterMask = 0xffff & ~EntityFilterCategory.Actor;

        this._super(b2world, properties);

    },

    update: function(delta) {

        this._super(delta);

        this._damageTime -= delta;
        if (this._damageTime < 0)
            this._damageTime = 0;

        this._attackTime -= delta;
        if (this._attackTime < 0)
            this._attackTime = 0;

        this._attackDelay -= delta;
        if (this._attackDelay < 0)
            this._attackDelay = 0;

        if (this.node) {
            var parentNode = this.node.getParent();
            if (parentNode) {
                var zOrder = kZOrderBase - this.node.getPosition().y;
                this.node.getParent().reorderChild(this.node, zOrder);
            }
        }

        if (this.automaticMovement) {

            var stopVelocityMultiplier = kStopVelocityMultiplier;
            if (this._damageTime > 0 || this._attackTime > 0) {
                stopVelocityMultiplier = kStopVelocityMultiplierWhenDamaged;
                this.horizontalMovingState = MovingState.Stopped;
                this.verticalMovingState = MovingState.Stopped;
            }

            var desiredXVel = 0;
            var desiredYVel = 0;
            var velocity = this.b2body.GetLinearVelocity();
            var maxForce = kWalkForce * this._walkForceModifier;
            var xAdditionFactor = 0.333;
            var yAdditionFactor = 0.333;

            switch (this.horizontalMovingState)
            {
                case MovingState.Left:
                    this.node.setFlippedX(true);
                    desiredXVel = Math.max( velocity.get_x() - (maxForce * xAdditionFactor), -maxForce );
                    break;
                case MovingState.Stopped:
                    desiredXVel = velocity.get_x() * stopVelocityMultiplier;
                    break;
                case MovingState.Right:
                    this.node.setFlippedX(false);
                    desiredXVel = Math.min( velocity.get_x() + (maxForce * xAdditionFactor),  maxForce );
                    break;
            }

            switch (this.verticalMovingState)
            {
                case MovingState.Up:
                    desiredYVel = Math.min( velocity.get_y() + (maxForce * yAdditionFactor),  maxForce );
                    break;
                case MovingState.Stopped:
                    desiredYVel = velocity.get_y() * stopVelocityMultiplier;
                    break;
                case MovingState.Down:
                    desiredYVel = Math.max( velocity.get_y() - (maxForce * yAdditionFactor), -maxForce );
                    break;
            }

            var xVelChange = desiredXVel - velocity.get_x();
            var yVelChange = desiredYVel - velocity.get_y();
            var xImpulse = this.b2body.GetMass() * xVelChange;
            var yImpulse = this.b2body.GetMass() * yVelChange;

            this.b2body.ApplyLinearImpulse( new b2Vec2(xImpulse, yImpulse), this.b2body.GetWorldCenter() );

        }

        this._updateAnimation();

    },

    attack: function() {

        if (this.state == GameObjectState.Dead || this.state == GameObjectState.Dying)
            return;

        if (this._attackDelay > 0 || this._damageTime > 0)
            return;
        this._attackTime = kDefaultAttackTime;
        this._attackDelay = kDefaultAttackTime * 3.5;

        var anim = this._loadAnimation(this._spriteFrameName + this._attackFrameName,
            this._attackFrameCount,
            kDefaultAttackTime / this._attackFrameCount);

        this.node.stopAllActions();
        this.node.runAction(cc.Animate.create(anim));

    },

    takeHit: function(direction) {

        if (this.state == GameObjectState.Dead || this.state == GameObjectState.Dying)
            return;

        if (this._damageTime > 0)
            return;
        this._damageTime = kPlayerDamageTime;
        this._attackTime = 0;
        this._attackDelay = 0;

        this.life--;

        if (this.life <= 0)
            this.die();

        var impulse = new b2Vec2(direction == MovingState.Right ? kPlayerDamageImpulseX : -kPlayerDamageImpulseX, 0);

        this.b2body.SetLinearVelocity(new b2Vec2(0, 0));
        this.b2body.ApplyLinearImpulse(impulse, this.b2body.GetWorldCenter());

        var anim = this._loadAnimation(this._spriteFrameName + this._damageFrameName,
            this._damageFrameCount,
            kPlayerDamageTime / this._damageFrameCount);

        if (this.state != GameObjectState.Dead && this.state != GameObjectState.Dying)
            this.node.stopAllActions();
        this.node.runAction(cc.Animate.create(anim));

    },

    die: function() {

        this._super();

        if (this.smokeBatchNode) {
            var smokeParticle = cc.ParticleSystem.create(plist_DeathSmoke);
            this.smokeBatchNode.addChild(smokeParticle);
        }

    }

});