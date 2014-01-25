
var Actor = GameObject.extend({

    // public properties

    movingState: MovingState.Stopped,

    // "private" properties

    _walkForceModifier: 1,
    _jumpTime: 0,
    _damageTime: 0,
    _currentCanJump: false,

    // "private" methods

    _canJump: function() {

        if (this._jumpTime > 0)
            return false;

        var contacts = this._contacts[ContactType.Foot];

        for (var c in contacts) {
            var contactContainer = contacts[c].contactContainer;

            if (contactContainer.type == ContactType.Floor)
                return true;
        }

        return false;
    },

    _isHittingHead: function() {

        var contacts = this._contacts[ContactType.Head];

        for (var c in contacts) {
            var contactContainer = contacts[c].contactContainer;

            if (contactContainer.type == ContactType.Floor)
                return true;
        }

        return false;
    },

    _updateAnimation: function() {

        var canJump = this._currentCanJump;

        if (canJump && this.state == GameObjectState.Standing && (this.movingState == MovingState.Left || this.movingState == MovingState.Right)) {

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

            if (!canJump) {

                this.node.stopAllActions();

                var velY = this.b2body.GetLinearVelocity().get_y();
                var limit = 5;

                if (velY > limit)
                    this.node.setDisplayFrame(this._spriteCache.getSpriteFrame(this._spriteFrameName + "_8.png"));
                else if (velY > limit / 2)
                    this.node.setDisplayFrame(this._spriteCache.getSpriteFrame(this._spriteFrameName + "_1.png"));
                else if (velY > -limit / 2)
                    this.node.setDisplayFrame(this._spriteCache.getSpriteFrame(this._spriteFrameName + "_2.png"));
                else
                    this.node.setDisplayFrame(this._spriteCache.getSpriteFrame(this._spriteFrameName + "_4.png"));

            } else if (this.state == GameObjectState.Standing)
                this._setIdleFrame();

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

        this._currentCanJump = this._canJump();

        if (this._jumpTime > 0) this._jumpTime -= delta;
        else if (this._jumpTime < 0) this._jumpTime = 0;

        if (this.state == GameObjectState.Standing && this.movingState == MovingState.Stopped && this._currentCanJump)
            this.b2body.SetGravityScale(0.0);
        else
            this.b2body.SetGravityScale(1.0);

        var stopVelocityMultiplier = kStopVelocityMultiplier;
        if (this._damageTime > 0) {
            stopVelocityMultiplier = kStopVelocityMultiplierWhenDamaged;
            this.movingState = MovingState.Stopped;
        }

        var desiredXVel = 0;
        var desiredYVel = 0;
        var velocity = this.b2body.GetLinearVelocity();
        var maxForce = kWalkForce * this._walkForceModifier;
        var xAdditionFactor = 0.333;

        switch (this.movingState)
        {
            case MovingState.Left:
                this.node.setFlippedX(true);
                desiredXVel = Math.max( velocity.get_x() - (maxForce * xAdditionFactor), -maxForce );
                break;
            case MovingState.Stopped:
                desiredXVel = velocity.get_x() * stopVelocityMultiplier;
                if (this._currentCanJump)
                    desiredYVel = velocity.get_y() * stopVelocityMultiplier;
                break;
            case MovingState.Right:
                this.node.setFlippedX(false);
                desiredXVel = Math.min( velocity.get_x() + (maxForce * xAdditionFactor),  maxForce );
                break;
        }

        var xVelChange = desiredXVel - velocity.get_x();
        var yVelChange = desiredYVel > 0 ? desiredYVel - velocity.get_y() : 0;
        var xImpulse = this.b2body.GetMass() * xVelChange;
        var yImpulse = this.b2body.GetMass() * yVelChange;

        if (this.state == GameObjectState.JumpStarting) {

            if (this._isHittingHead()) {
                this._jumpTime = 0;

                yImpulse = this.b2body.GetMass();
            }

            if (this._jumpTime > 0) {

                velocity = this.b2body.GetLinearVelocity();
                desiredYVel = kJumpForce;

                yVelChange = desiredYVel - velocity.get_y();
                yImpulse = this.b2body.GetMass() * yVelChange;

            } else {
                this.state = GameObjectState.Jumping;
            }

        }

        this.b2body.ApplyLinearImpulse( new b2Vec2(xImpulse, yImpulse), this.b2body.GetWorldCenter() );

        if (this.state == GameObjectState.Jumping && this._jumpTime <= 0 && this._currentCanJump)
            this.state = GameObjectState.Standing;

        this._updateAnimation();

    },

    jump: function() {

        if (this.state != GameObjectState.Standing || !this._canJump() || this._damageTime > 0)
            return;

        this.state = GameObjectState.JumpStarting;
        this._jumpTime = kJumpTime;

    },

    finishJump: function() {

        if (this.state != GameObjectState.JumpStarting)
            return;
        this.state = GameObjectState.Jumping;

    }

});