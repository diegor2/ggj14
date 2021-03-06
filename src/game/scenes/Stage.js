
//var myDebugDraw;

var Stage = BaseLayer.extend({

    // input management

    _buttonLeftPressed: false,
    _buttonRightPressed: false,
    _buttonUpPressed: false,
    _buttonDownPressed: false,
    _buttonAPressed: false,
    _buttonStartPressed: false,

    // "private" properties

    _level: 1,
    _halfWinSize: null,
    _tileMapSize: null,
    _bgSize: null,
    _contactListener: null,

    _bgNode: null,
    _mainLayer: null,
    _mainBatchNode: null,
    _smokeBatchNode: null,
    _tiledMap: null,
    _hudLayer: null,
    _pauseLayer: null,
    _pauseButton: null,
    _pauseMenuContainer: null,

    _movingStates: null,
    _gameObjects: null,
    _enemies: null,
    _player: null,
    _b2world: null,
    _frameAccumulator: 0,
    _stageTime: 0,
    _state: StageState.Starting,

    // public methods

    init:function (level) {
        this._super();

        this._level = level;
        this._movingStates = [MovingState.Stopped];
        this._gameObjects = [];
        this._enemies = [];

        cc.SpriteFrameCache.getInstance().addSpriteFrames(plist_Chars);

        this._contactListener = createContactListener();
        this._mainLayer = cc.Layer.create();
        this._mainBatchNode = cc.SpriteBatchNode.create(img_Chars);
        this._tiledMap = cc.TMXTiledMap.create(kTmxPrefix + level + ".tmx");

        this._halfWinSize = cc.size(this._winSize.width / 2, this._winSize.height / 2);
        this._tileMapSize = cc.size(
            this._tiledMap.getMapSize().width * this._tiledMap.getTileSize().width,
            this._tiledMap.getMapSize().height * this._tiledMap.getTileSize().height
        );

        //var smokeParticle = cc.ParticleSystem.create(plist_DeathSmoke);
        //this._smokeBatchNode = cc.ParticleBatchNode.createWithTexture(smokeParticle.getTexture());
        //smokeParticle = null;

        this._mainLayer.addChild(this._tiledMap);
        this._mainLayer.addChild(this._mainBatchNode);
        //this._mainLayer.addChild(this._smokeBatchNode);

        var mapProperties = this._tiledMap.getProperties()[0];

        this._bgNode = cc.Sprite.create(mapProperties["bg"]);
        this._bgNode.setAnchorPoint(cc.p(0, 0));
        this._bgSize = this._bgNode.getContentSize();

        this.addChild(this._bgNode);
        this.addChild(this._mainLayer);

        var gravity = new b2Vec2(0, kGravity);

        //myDebugDraw = getCanvasDebugDraw();
        //myDebugDraw.SetFlags(e_shapeBit|e_jointBit|e_aabbBit|e_pairBit|e_centerOfMassBit);

        this._b2world = new b2World(gravity, true);
        this._b2world.SetContinuousPhysics(true);
        this._b2world.SetContactListener(this._contactListener);
        //this._b2world.SetDebugDraw(myDebugDraw);

        var gameObjectsGroup = this._tiledMap.getObjectGroup("objects");
        var collisionGroup = this._tiledMap.getObjectGroup("collision");

        var gameObjects = gameObjectsGroup.getObjects();
        var collisions = collisionGroup.getObjects();

        for (var o in gameObjects) {
            var gameObjectProperties = gameObjects[o];

            var type = gameObjectProperties["type"];

            if (!type)
                continue;

            switch (type) {

                case "Player":
                    this._player = new Player();
                    this._player.init(this._b2world, gameObjectProperties);
                    this._player.stage = this;
                    break;

                case "ChildPlayer":
                    this._player = new ChildPlayer();
                    this._player.init(this._b2world, gameObjectProperties);
                    this._player.stage = this;
                    break;

                case "ElderPlayer":
                    this._player = new ElderPlayer();
                    this._player.init(this._b2world, gameObjectProperties);
                    this._player.stage = this;
                    break;

                case "YoungPlayer":
                    this._player = new YoungPlayer();
                    this._player.init(this._b2world, gameObjectProperties);
                    this._player.stage = this;
                    break;

                case "ChildEnemy":
                    this._createEnemy(ChildEnemy, gameObjectProperties);
                    break;

                case "ElderEnemy":
                    this._createEnemy(ElderEnemy, gameObjectProperties);
                    break;

                case "YoungEnemy":
                    this._createEnemy(YoungEnemy, gameObjectProperties);
                    break;

                case "Dragon":
                    this._createEnemy(Dragon, gameObjectProperties);
                    break;

                case "Dragon2":
                    this._createEnemy(Dragon2, gameObjectProperties);
                    break;

                case "Thief":
                    this._createEnemy(Thief, gameObjectProperties);
                    break;

                case "Thief2":
                    this._createEnemy(Thief2, gameObjectProperties);
                    break;

                case "Doctor":
                    this._createEnemy(Doctor, gameObjectProperties);
                    break;

                case "Doctor2":
                    this._createEnemy(Doctor2, gameObjectProperties);
                    break;

                case "LevelEnd":
                    this._createGameObject(LevelEnd, gameObjectProperties);
                    break;

            }

        }

        for (var c in collisions) {
            var collisionProperties = collisions[c];

            var floorContact = new ContactContainer;
            floorContact.type = ContactType.Floor;

            var floorFixture = this._createStaticBody(collisionProperties);
            floorFixture.customData = floorContact;
        }

        for (var i = 0; i < this._enemies.length; i++) {
            this._enemies[i].player = this._player;
        }

        this._mainBatchNode.addChild(this._player.node);

        this._hudLayer = new HUDLayer();
        this._hudLayer.init(this._player, level);

        var pauseLabel = cc.LabelBMFont.create("PAUSED", fnt_Dialogue, this._winSize.width, cc.TEXT_ALIGNMENT_CENTER);
        pauseLabel.setAnchorPoint(cc.p(0.5, 0.5));
        pauseLabel.setPosition(cc.p(this._winSize.width / 2, this._winSize.height / 2));

        this._pauseLayer = cc.LayerColor.create(cc.c4b(0, 0, 0, 100));
        this._pauseLayer.setVisible(false);
        this._pauseLayer.addChild(pauseLabel);

        this._buildPauseMenu();

        this.addChild(this._pauseLayer);
        this.addChild(this._hudLayer);
        this.updateMapPosition();
        this.scheduleUpdate();

    },

    _buildPauseMenu: function() {

        var optionsItem = cc.MenuItemSprite.create(
            cc.Sprite.createWithSpriteFrameName("options.png"),
            cc.Sprite.createWithSpriteFrameName("options_hover.png"),
            this.triggerPause,
            this
        );
        this._pauseButton = cc.Menu.create(optionsItem);
        this._pauseButton.setPosition(cc.p(this._winSize.width - 50, this._winSize.height - 48));
        this._hudLayer.addChild(this._pauseButton);

        var bg = cc.Sprite.createWithSpriteFrameName("options_bg.png");
        bg.setAnchorPoint(cc.p(1, 1));
        bg.setPosition(cc.p(this._winSize.width, this._winSize.height));

        var titleItem = cc.MenuItemLabel.create(cc.LabelBMFont.create("Exit", fnt_Dialogue, 170, cc.TEXT_ALIGNMENT_CENTER), this._goToTitle, this);

        var menu = cc.Menu.create(titleItem);

        menu.alignItemsVerticallyWithPadding(10);
        menu.setPosition(cc.p(this._winSize.width - 90, this._winSize.height - 66));

        this._pauseMenuContainer = cc.Layer.create();
        this._pauseMenuContainer.setAnchorPoint(cc.p(0, 0));
        this._pauseMenuContainer.setPosition(cc.p(this._halfWinSize.width / 2, this._halfWinSize.height / 2));
        this._pauseMenuContainer.addChild(bg);
        this._pauseMenuContainer.addChild(menu);

        this._pauseLayer.addChild(this._pauseMenuContainer);

    },

    _goToTitle: function() {
        cc.Director.getInstance().replaceScene(new TitleScene());
    },

    // returns the main fixture created for the body
    _createStaticBody: function(properties) {

        var x = properties["x"] / PTM_RATIO;
        var y = properties["y"] / PTM_RATIO;

        var width = properties["width"];
        var points = properties["polylinePoints"];
        var isLoop = false;
        if (!points) {
            points = properties["polygonPoints"];
            isLoop = true;
        }

        if (width) {

            var height = properties["height"];
            var halfWidth = (width / 2) / PTM_RATIO;
            var halfHeight = (height / 2) / PTM_RATIO;

            x += halfWidth;
            y += halfHeight;

            var shape = new b2PolygonShape;
            shape.SetAsBox(halfWidth, halfHeight);

            var fixtureDef = new b2FixtureDef;
            fixtureDef.set_shape(shape);

            var bodyDef = new b2BodyDef;
            bodyDef.set_type(b2_staticBody);
            bodyDef.set_position(new b2Vec2(x, y));

            var body = this._b2world.CreateBody(bodyDef);
            return body.CreateFixture(fixtureDef);

        } else if (points) {

            var verts = [];

            for (var p in points) {
                var point = points[p];

                var vertX = point["x"] / PTM_RATIO;
                var vertY = point["y"] / PTM_RATIO;

                verts.push(new b2Vec2(vertX, -vertY));
            }

            var pFixtureDef = new b2FixtureDef;
            pFixtureDef.set_shape(createChainShape(verts, isLoop));

            var pBodyDef = new b2BodyDef;
            pBodyDef.set_type(b2_staticBody);
            pBodyDef.set_position(new b2Vec2(x, y));

            var pBody = this._b2world.CreateBody(pBodyDef);
            return pBody.CreateFixture(pFixtureDef);
        }

        return null;
    },

    _createGameObject: function(type, properties) {

        var gameObject = new type();
        gameObject.init(this._b2world, properties);
        gameObject.stage = this;

        this._gameObjects.push(gameObject);
        if (gameObject.node)
            this._mainBatchNode.addChild(gameObject.node);

        if (gameObject instanceof Actor) {
            gameObject.smokeBatchNode = this._smokeBatchNode;
        }

        return gameObject;
    },

    _createEnemy: function(type, properties) {

        var gameObject = this._createGameObject(type, properties);
        gameObject.player = this._player;

        this._enemies.push(gameObject);

        return gameObject;
    },

/*
    draw: function(ctx) {
        this._super(ctx);
        this._b2world.DrawDebugData();
    },*/

    onEnterTransitionDidFinish: function() {
        this._state = StageState.Running;
    },

    update: function(delta) {

        if (this._state == StageState.Running) {

            this._stageTime += delta;
            this._frameAccumulator += delta;

            var stepCount = 0;
            while (this._frameAccumulator > kFixedStepTime) {
                this._frameAccumulator -= kFixedStepTime;

                stepCount++;
                if (stepCount > kMaxUpdatesPerFrame)
                    continue;

                this._b2world.Step(kFixedStepTime, 5, 1);

                var didFindHorizontalMovingState = false;
                var didFindVerticalMovingState = false;
                var movingStatesLength = this._movingStates.length;

                while (movingStatesLength--) {
                    var aMovingState = this._movingStates[movingStatesLength];
                    if (!didFindHorizontalMovingState && (aMovingState == MovingState.Left || aMovingState == MovingState.Right)) {
                        this._player.horizontalMovingState = aMovingState;
                        didFindHorizontalMovingState = true;
                    }
                    if (!didFindVerticalMovingState && (aMovingState == MovingState.Up || aMovingState == MovingState.Down)) {
                        this._player.verticalMovingState = aMovingState;
                        didFindVerticalMovingState = true;
                    }
                }

                if (!didFindHorizontalMovingState)
                    this._player.horizontalMovingState = MovingState.Stopped;
                if (!didFindVerticalMovingState)
                    this._player.verticalMovingState = MovingState.Stopped;

                this._player.update(kFixedStepTime);
                this._hudLayer.update(kFixedStepTime);

                for (var g in this._gameObjects) {
                    this._gameObjects[g].update(kFixedStepTime);
                }

                var i;

                for (i = 0; i < this._gameObjects.length; i++) {
                    if (this._gameObjects[i].state == GameObjectState.Dead) {
                        this._gameObjects.splice(i, 1);
                        i--;
                    }
                }

                for (i = 0; i < this._enemies.length; i++) {
                    if (this._enemies[i].state == GameObjectState.Dead) {
                        this._enemies.splice(i, 1);
                        i--;
                    }
                }

                if (this._player.state == GameObjectState.Dead) {
                    this.end(false);
                    return;
                }

                if (this._enemies.length == 0) {
                    this.end(true);
                    return;
                }

            }
        }

        this.updateMapPosition();

    },

    updateMapPosition: function() {

        var playerPosition = this._player.node ? this._player.node.getPosition() : cc.p(0, 0);

        var x = Math.max(playerPosition.x, this._halfWinSize.width);
        var y = Math.max(playerPosition.y, this._halfWinSize.height);
        x = Math.min(x, this._tileMapSize.width - this._halfWinSize.width);
        y = Math.min(y, this._tileMapSize.height - this._halfWinSize.height);

        var actualPosition = cc.p(x, y);
        var centerOfView = cc.p(this._halfWinSize.width, this._halfWinSize.height);
        var viewPoint = cc.pSub(centerOfView, actualPosition);

        this._mainLayer.setPosition(viewPoint);

        var mapWidthDiff = this._winSize.width - this._tileMapSize.width;
        var bgWidthDiff = this._winSize.width - this._bgSize.width;
        var mapHeightDiff = this._winSize.height - this._tileMapSize.height;
        var bgHeightDiff = this._winSize.height - this._bgSize.height;

        var bgX = (viewPoint.x / mapWidthDiff) * bgWidthDiff;
        var bgY = (viewPoint.y / mapHeightDiff) * bgHeightDiff;

        this._bgNode.setPosition(cc.p(bgX, bgY));

    },

    end: function(win) {

        this._state = StageState.Ended;
        this.unscheduleUpdate();

        var nextLevel = this._level + 1;

        if (this._level < kMaxLevel && !win)
            cc.Director.getInstance().replaceScene(new TitleScene());
        else
            cc.Director.getInstance().replaceScene(new DialogueScene(nextLevel, win));

    },

    // ------------------------------------------------------------------------------------------
    // INPUT
    // ------------------------------------------------------------------------------------------

    _handleKey: function(key, pressed) {

        if (this._state == StageState.Starting || this._state == StageState.Ended)
            return;

        this._super(key, pressed);

    },

    buttonUp: function(pressed) {

        if (pressed) {

            if (this._buttonUpPressed)
                return;
            this._buttonUpPressed = true;

            this._movingStates.push(MovingState.Up);

        } else {

            this._buttonUpPressed = false;

            var movingStateIndex = this._movingStates.indexOf(MovingState.Up);
            if (movingStateIndex != -1)
                this._movingStates.splice(movingStateIndex, 1);

        }

    },

    buttonDown: function(pressed) {

        if (pressed) {

            if (this._buttonDownPressed)
                return;
            this._buttonDownPressed = true;

            this._movingStates.push(MovingState.Down);

        } else {

            this._buttonDownPressed = false;

            var movingStateIndex = this._movingStates.indexOf(MovingState.Down);
            if (movingStateIndex != -1)
                this._movingStates.splice(movingStateIndex, 1);

        }

    },

    buttonLeft: function(pressed) {

        if (pressed) {

            if (this._buttonLeftPressed)
                return;
            this._buttonLeftPressed = true;

            this._movingStates.push(MovingState.Left);

        } else {

            this._buttonLeftPressed = false;

            var movingStateIndex = this._movingStates.indexOf(MovingState.Left);
            if (movingStateIndex != -1)
                this._movingStates.splice(movingStateIndex, 1);

        }

    },

    buttonRight: function(pressed) {

        if (pressed) {

            if (this._buttonRightPressed)
                return;
            this._buttonRightPressed = true;

            this._movingStates.push(MovingState.Right);

        } else {

            this._buttonRightPressed = false;

            var movingStateIndex = this._movingStates.indexOf(MovingState.Right);
            if (movingStateIndex != -1)
                this._movingStates.splice(movingStateIndex, 1);

        }

    },

    buttonA: function(pressed) {

        if (!pressed) {
            this._buttonAPressed = false;
            return;
        }

        if (this._buttonAPressed)
            return;
        this._buttonAPressed = true;

        this._player.attack();

    },

    buttonB: function(pressed) {

        if (!pressed)
            return;

        if (this._state == StageState.Paused)
            this.triggerPause();

    },

    buttonStart: function(pressed) {

        if (!pressed) {
            this._buttonStartPressed = false;
            return;
        }

        if (this._buttonStartPressed)
            return;
        this._buttonStartPressed = true;

        this.triggerPause();

    },

    triggerPause: function() {

        var animationDuration = 0.1;

        if (this._state == StageState.Running) {
            this._state = StageState.Paused;

            this._pauseLayer.setVisible(true);
            this.recursivelyPauseAllChildren(this._mainLayer);

            this._pauseButton.stopAllActions();
            this._pauseMenuContainer.stopAllActions();

            this._pauseButton.runAction(cc.MoveTo.create(
                animationDuration,
                cc.p(this._winSize.width - 200, this._winSize.height - 144)
            ));

            this._pauseMenuContainer.runAction(cc.MoveTo.create(
                animationDuration,
                cc.p(0, 0)
            ));

        } else if (this._state == StageState.Paused) {
            this._state = StageState.Running;

            this._pauseLayer.setVisible(false);
            this.recursivelyResumeAllChildren(this._mainLayer);

            this._pauseButton.stopAllActions();
            this._pauseMenuContainer.stopAllActions();

            this._pauseButton.runAction(cc.MoveTo.create(
                animationDuration,
                cc.p(this._winSize.width - 50, this._winSize.height - 48)
            ));

            this._pauseMenuContainer.runAction(cc.MoveTo.create(
                animationDuration,
                cc.p(this._halfWinSize.width / 2, this._halfWinSize.height / 2)
            ));

        }

    }

});

var StageScene = cc.Scene.extend({
    _level: 1,

    ctor: function(level) {
        this._super();
        this._level = level;
    },

    onEnter: function () {
        this._super();
        var layer = new Stage();
        layer.init(this._level);
        this.addChild(layer);
    }

});
