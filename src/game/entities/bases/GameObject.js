
var ContactContainer = cc.Class.extend({
    type: ContactType.Unknown,
    gameObject: null
});

var ContactCounter = cc.Class.extend({
    contactContainer: null,
    count: 0
});

var GameObject = cc.Class.extend({

    // public properties

    stage: null,
    state: GameObjectState.Standing,
    type: GameObjectType.Unknown,
    node: null,
    b2body: null,

    // "private" properties

    _isSensor: false,
    _spriteCache: null,
    _spriteFrameName: "",
    _idleFrameName: "",
    _contacts: null,
    _isb2bodyDestroyed: false,
    _initialPosition: null,

    // private methods

    _setProperties: function(properties) {

        if (!properties)
            return;

        var x = properties["x"] + properties["width"] / 2;
        var y = properties["y"] + properties["height"] / 2;

        this._initialPosition = cc.p(x, y);

        if (this.node)
            this.node.setPosition(this._initialPosition);

    },

    _addCircularFixture: function(radius) {

        var scale = this.node ? this.node.getScale() : 1;

        var shape = new b2CircleShape;
        shape.set_m_radius(radius * scale / PTM_RATIO);
        this._createFixture(shape);

    },

    _addRectangularFixture: function(width, height, x, y) {

        var shape = new b2PolygonShape;
        var scale = this.node ? this.node.getScale() : 1;

        if (typeof(x) != 'undefined' && typeof(y) != 'undefined') {

            shape.SetAsBox(
                width / 2 * scale / PTM_RATIO,
                height / 2 * scale / PTM_RATIO,
                new b2Vec2(x * scale / PTM_RATIO, y * scale / PTM_RATIO),
                0);

        } else {

            shape.SetAsBox(
                width / 2 * scale / PTM_RATIO,
                height / 2 * scale / PTM_RATIO);

        }

        this._createFixture(shape);

    },

    _createFixture: function(b2shape) {

        var contactContainer = new ContactContainer
        contactContainer.type = ContactType.Body;
        contactContainer.gameObject = this;

        //fixture definition
        var fixtureDef = new b2FixtureDef;
        fixtureDef.set_shape(b2shape);
        fixtureDef.set_density(1);
        fixtureDef.set_friction(0);
        fixtureDef.set_restitution(0);
        fixtureDef.set_isSensor(this._isSensor);

        var aFixture = this.b2body.CreateFixture(fixtureDef);
        aFixture.customData = contactContainer;

    },

    _createSensorFixture: function(b2shape, contactContainer) {

        contactContainer.gameObject = this;

        //fixture definition
        var fixtureDef = new b2FixtureDef;
        fixtureDef.set_shape(b2shape);
        fixtureDef.set_density(0);
        fixtureDef.set_isSensor(true);

        //add sensor fixture
        var aFixture = this.b2body.CreateFixture(fixtureDef);
        //aFixture.SetUserData(sensorTypeContainer);
        aFixture.customData = contactContainer;

    },

    _addFixtures: function() {

    },

    // public methods

    init: function(b2world, properties) {

        this._contacts = {};

        var contactTypes = [ContactType.Body, ContactType.LeftHitArea, ContactType.RightHitArea];

        for (var c in contactTypes) {
            this._contacts[contactTypes[c]] = [];
        }

        if (this.node) {
            this.node.setAnchorPoint(cc.p(0.5, 0));
        }

        this._initialPosition = cc.p(0, 0);
        this._spriteCache = cc.SpriteFrameCache.getInstance();
        this._setProperties(properties);
        this.addBodyToWorld(b2world);
        this._addFixtures();

    },

    update: function(delta) {

        if (!this._isSensor && this.node) {
            var position = this.b2body.GetPosition();
            this.node.setPosition(position.get_x() * PTM_RATIO, position.get_y() * PTM_RATIO);
        }

        this.handleCollisions();

    },

    die: function() {
        this.state = GameObjectState.Dead;
        this.destroyBody();
        if (this.node)
            this.node.removeFromParent(true);
    },

    destroyBody: function() {
        if (this._isb2bodyDestroyed)
            return;

        this._isb2bodyDestroyed = true;
        this.b2body.GetWorld().DestroyBody(this.b2body);
    },

    addBodyToWorld: function(b2world) {

        var bodyDef = new b2BodyDef;

        bodyDef.set_type(b2_dynamicBody);
        bodyDef.set_position(new b2Vec2(this._initialPosition.x / PTM_RATIO, this._initialPosition.y / PTM_RATIO));
        //bodyDef.set_userData(this);
        bodyDef.customData = this;
        bodyDef.set_fixedRotation(true);

        this.b2body = b2world.CreateBody(bodyDef);

    },

    addContact: function(contactType, contact) {

        var contacts = this._contacts[contactType];
        if (!contacts)
            return;
        var contactCounter;

        for (var c = 0; c < contacts.length; c++) {
            contactCounter = contacts[c];
            if (contact == contactCounter.contactContainer) {

                contactCounter.count++;

                return;
            }
        }

        contactCounter = new ContactCounter
        contactCounter.contactContainer = contact;
        contactCounter.count = 1;

        contacts.push(contactCounter);
    },

    removeContact: function(contactType, contact) {

        var contacts = this._contacts[contactType];
        if (!contacts)
            return;
        var contactCounter;

        for (var c = 0; c < contacts.length; c++) {
            contactCounter = contacts[c];
            if (contact == contactCounter.contactContainer) {

                contactCounter.count--;
                if (contactCounter.count == 0) {
                    contacts.splice(c, 1);
                }

                return;
            }
        }
    },

    handleCollisions: function() {

        var contacts = this._contacts[ContactType.Body];

        for(var c in contacts)
        {
            var contactContainer = contacts[c].contactContainer;
            if(!contactContainer)
                continue;

            if(contactContainer.gameObject instanceof GameObject) {
                if(contactContainer.gameObject.state != GameObjectState.Dead)
                    this.handleCollisionWithGameObject(contactContainer.gameObject);
                continue;
            }

            this.handleCollision(contactContainer);
        }

    },

    handleCollisionWithGameObject: function (gameObject) {

    },

    handleCollision: function (contactContainer) {

    }

});