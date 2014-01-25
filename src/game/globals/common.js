
var kMaxLevel = 2;
var kTmxPrefix = "stage";

var PTM_RATIO = 32.0;
var kGravity = (-PTM_RATIO * 0.0);
var kFixedStepTime = 0.0166666;
var kMaxUpdatesPerFrame = 10;

var kIdleActionTag = 400;
var kWalkActionTag = 500;
var kWalkForce = 3.0;

var kPlayerDamageTime = 0.5;
var kPlayerDamageImpulseX = 1.1;
var kStopVelocityMultiplier = 0.6;
var kStopVelocityMultiplierWhenDamaged = 0.7;
var kDefaultAttackTime = 0.2;
var kPlayerMaxLife = 6;
var kEnemyMaxLife = 4;

var kEnemyPeacefulDistance = 2.0;
var kEnemyAtackDistance = 0.05;

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
    Dead: 2
};

var EnemyState = {
    Defence: 0,
    Roaming: 1,
    Attack: 2,
};

var GameObjectType  = {
    Unknown: 0,
    Player: 1,
    Enemy: 2,
    Bone: 3,
    Cookie: 4,
    LevelEnd: 5
};

var ContactType = {
    Unknown: 7,
    Floor: 8,
    Body: 9,
    RightHitArea: 10,
    LeftHitArea: 10
};