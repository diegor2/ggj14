
var Actor = GameObject.extend({

    // public properties

    horizontalMovingState: MovingState.Stopped,
    verticalMovingState: MovingState.Stopped,
    automaticMovement: true,

    // "private" properties

    _walkForceModifier: 1,
    _damageTime: 0,
    _attackTime: 0,
    _life: 5,

    // "private" methods

    _updateAnimation: function() {

        if (this.state == GameObjectState.Standing) {
            if (this.horizontalMovingState == MovingState.Left || this.horizontalMovingState == MovingState.Right || this.verticalMovingState == MovingState.Up || this.verticalMovingState == MovingState.Down) {

                var speed = Math.abs(this.b2body.GetLinearVelocity().get_x()) * 6;
                var walkAction = this.node.getActionByTag(kWalkActionTag);

                if (!walkAction) {

                    var spriteCache = this._spriteCache;

                    var anim = cc.Animation.create();
                    anim.setDelayPerUnit(1);
                    anim.setRestoreOriginalFrame(true);

                    anim.addSpriteFrame(spriteCache.getSpriteFrame(this._spriteFrameName + "_1.png"));
                    anim.addSpriteFrame(spriteCache.getSpriteFrame(this._spriteFrameName + "_2.png"));
                    anim.addSpriteFrame(spriteCache.getSpriteFrame(this._spriteFrameName + "_3.png"));
                    anim.addSpriteFrame(spriteCache.getSpriteFrame(this._spriteFrameName + "_4.png"));
                    anim.addSpriteFrame(spriteCache.getSpriteFrame(this._spriteFrameName + "_5.png"));
                    anim.addSpriteFrame(spriteCache.getSpriteFrame(this._spriteFrameName + "_6.png"));
                    anim.addSpriteFrame(spriteCache.getSpriteFrame(this._spriteFrameName + "_7.png"));
                    anim.addSpriteFrame(spriteCache.getSpriteFrame(this._spriteFrameName + "_8.png"));

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

        var spriteCache = this._spriteCache;

        var anim = cc.Animation.create();
        anim.setDelayPerUnit(0.075);
        anim.setRestoreOriginalFrame(true);

        anim.addSpriteFrame(spriteCache.getSpriteFrame(this._spriteFrameName + this._idleFrameName + "_1.png"));
        anim.addSpriteFrame(spriteCache.getSpriteFrame(this._spriteFrameName + this._idleFrameName + "_2.png"));
        anim.addSpriteFrame(spriteCache.getSpriteFrame(this._spriteFrameName + this._idleFrameName + "_3.png"));
        anim.addSpriteFrame(spriteCache.getSpriteFrame(this._spriteFrameName + this._idleFrameName + "_4.png"));
        anim.addSpriteFrame(spriteCache.getSpriteFrame(this._spriteFrameName + this._idleFrameName + "_5.png"));
        anim.addSpriteFrame(spriteCache.getSpriteFrame(this._spriteFrameName + this._idleFrameName + "_6.png"));
        anim.addSpriteFrame(spriteCache.getSpriteFrame(this._spriteFrameName + this._idleFrameName + "_7.png"));
        anim.addSpriteFrame(spriteCache.getSpriteFrame(this._spriteFrameName + this._idleFrameName + "_8.png"));

        idleAction = cc.RepeatForever.create(cc.Animate.create(anim));
        idleAction.setTag(kIdleActionTag);

        this.node.stopAllActions();
        this.node.runAction(idleAction);

    },

    // public methods

    init: function(b2world, properties) {

        this._idleFrameName = "_idle";

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

        if (this.automaticMovement) {

            var stopVelocityMultiplier = kStopVelocityMultiplier;
            if (this._damageTime > 0) {
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

    }

});