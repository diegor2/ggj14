
var kMaxLevel = 4;
var kTmxPrefix = "stage";

var PTM_RATIO = 32.0;
var kGravity = (-PTM_RATIO * 0.0);
var kFixedStepTime = 0.0166666;
var kMaxUpdatesPerFrame = 10;

var kZOrderBase = 200;
var kIdleActionTag = 400;
var kWalkActionTag = 500;

var kWalkForce = 12.0;
var kWalkAnimSpeedFactor = 2;

var kPlayerDamageTime = 0.3;
var kPlayerDamageImpulseX = 5000.0;
var kStopVelocityMultiplier = 0.6;
var kStopVelocityMultiplierWhenDamaged = 0.7;
var kDefaultAttackTime = 0.1;
var kPlayerMaxLife = 6;
var kEnemyMaxLife = 6;

var kEnemyPeacefulDistance = 30.0;
var kEnemyAttackDistance = 4;

var MovingState = {
    Stopped: 0,
    Left: 1,
    Right: 2,
    Up: 3,
    Down: 4
};

var StageState = {
    Starting: 0,
    Running: 1,
    Paused: 2,
    Ended: 3
};

var GameObjectState = {
    Standing: 0,
    Dying: 1,
    Dead: 2,
    Attack: 3
};

var GameObjectType  = {
    Unknown: 0,
    Player: 1,
    Enemy: 2,
    LevelEnd: 3
};

var ContactType = {
    Unknown: 7,
    Floor: 8,
    Body: 9,
    RightHitArea: 10,
    LeftHitArea: 11,
    DamageArea: 12
};

var EntityFilterCategory = {
    Actor: 0x0002
};