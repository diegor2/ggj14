
var Dialogue = BaseLayer.extend({

    _buttonAPressed: false,
    _nextLevel: 0,
    _dialogueStep: 0,
    _messageLength: 0,
    _messages: null,
    _started: false,
    _isWaitingInput: false,
    _textLabel: null,

    init: function(nextLevel, win) {
        this._super();

        this._nextLevel = nextLevel;

        var spriteCache = cc.SpriteFrameCache.getInstance();

        spriteCache.addSpriteFrames(plist_Chars);

        var winSize = cc.Director.getInstance().getWinSize();

        this._messages = [];
        this._dialogueStep = 0;
        this._messageLength = 0;
        var spriteFrameNames = [];
        var bgName = "";

        switch (nextLevel) {
            case 2:
                this._messages.push("Son! Stop playing around...");
                this._messages.push("Care about your future and try not to throw it away.");
                this._messages.push("You don't need to walk faster than the time, but\nit's necessary to follow it.");
                //spriteFrameNames.push("child_idle_1.png");
                //spriteFrameNames.push("child_idle_2.png");
                bgName = img_Dialogue1Bg;
                break;
            case 3:
                this._messages.push("Hey!");
                this._messages.push("Where is the report for today?");
                this._messages.push("Photos are not enough!\nTry clearing your vision and mature your mind.");
                //spriteFrameNames.push("child_idle_1.png");
                //spriteFrameNames.push("child_idle_2.png");
                bgName = img_Dialogue2Bg;
                break;
            case 4:
                this._messages.push("What the...?");
                //spriteFrameNames.push("child_idle_1.png");
                //spriteFrameNames.push("child_idle_2.png");
                bgName = img_Stage4Bg;
                break;
            case 5:
                if (win) {
                    this._messages.push("What do you see?\nYourself?");
                    this._messages.push("Everything changes with time.");
                    this._messages.push("Look outside, outside yourself...\nBecause the world is not what you make of it.");
                    //spriteFrameNames.push("child_idle_1.png");
                    //spriteFrameNames.push("child_idle_2.png");
                    bgName = img_Stage4Bg;
                } else {
                    this._messages.push("Get a life, a REAL life.\nYou don't live only according to what you want to see.");
                    //spriteFrameNames.push("child_idle_1.png");
                    //spriteFrameNames.push("child_idle_2.png");
                    bgName = img_Stage4Bg;
                }
                break;
        }

        if (bgName != "") {

            var bg = cc.Sprite.create(bgName);
            bg.setAnchorPoint(cc.p(0, 0));
            bg.setPosition(cc.p(0, 0));

            this.addChild(bg);
        }

        if (spriteFrameNames.length > 0) {

            var character = cc.Sprite.createWithSpriteFrameName(spriteFrameNames[0]);
            character.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
            this.addChild(character);

            var anim = cc.Animation.create();

            anim.setDelayPerUnit(0.5);
            anim.setRestoreOriginalFrame(true);

            for (var i = 0; i < spriteFrameNames.length; i++){
                var frame = spriteCache.getSpriteFrame(spriteFrameNames[i]);
                if (frame)
                    anim.addSpriteFrame(frame);
            }

            var action = cc.RepeatForever.create(cc.Animate.create(anim));
            character.runAction(action);
        }

        this._textLabel = cc.LabelBMFont.create("", fnt_Dialogue, winSize - 40, cc.TEXT_ALIGNMENT_LEFT);
        this._textLabel.setAnchorPoint(cc.p(0, 1));
        this._textLabel.setPosition(cc.p(20, winSize.height - 30));

        this.addChild(this._textLabel);

        this.runAction(cc.Sequence.create([
            cc.DelayTime.create(1),
            cc.CallFunc.create(this.startDialogue, this),
            cc.CallFunc.create(this.drawLetter, this)
        ]));

    },

    startDialogue: function() {
        this._started = true;
    },

    drawLetter: function() {

        var currentMessage = this._messages[this._dialogueStep];

        this._messageLength++;

        this._textLabel.setString(currentMessage.substr(0, this._messageLength));

        if (this._messageLength < currentMessage.length) {
            this.runAction(cc.Sequence.create([
                cc.DelayTime.create(0.025),
                cc.CallFunc.create(this.drawLetter, this)
            ]));
        } else {
            this._dialogueStep++;
            this._isWaitingInput = true;
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

        if (!this._started)
            return;

        if (!this._isWaitingInput) {
            this._messageLength = this._messages[this._dialogueStep].length - 1;
            return;
        }

        if (this._dialogueStep >= this._messages.length) {
            if (this._nextLevel <= kMaxLevel)
                cc.Director.getInstance().replaceScene(new StageScene(this._nextLevel));
            else
                cc.Director.getInstance().replaceScene(new TitleScene());
        } else {
            this._isWaitingInput = false;
            this._messageLength = 0;
            this.drawLetter();
        }

    }

});

var DialogueScene = cc.Scene.extend({
    _nextLevel: 1,

    ctor: function(level) {
        this._super();
        this._nextLevel = level;
    },

    onEnter: function () {
        this._super();
        var layer = new Dialogue();
        layer.init(this._nextLevel);
        this.addChild(layer);
    }

});