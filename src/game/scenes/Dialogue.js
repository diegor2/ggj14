
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
                this._messages.push("Olha só mamãe, tô testando esses textos aqui!\nUm bagulho doido que dói o zói!");
                this._messages.push("LAZARENTO DI MININO!");
                spriteFrameNames.push("child_idle_1.png");
                spriteFrameNames.push("child_idle_2.png");
                bgName = "castle.png";
                break;
            case 3:
                this._messages.push("Testando...");
                this._messages.push("E mais uma vez testando...");
                spriteFrameNames.push("child_idle_1.png");
                spriteFrameNames.push("child_idle_2.png");
                bgName = "castle.png";
                break;
            case 4:
                this._messages.push("Testando...");
                this._messages.push("E mais uma vez testando...");
                spriteFrameNames.push("child_idle_1.png");
                spriteFrameNames.push("child_idle_2.png");
                bgName = "castle.png";
                break;
            case 5:
                if (win) {
                    this._messages.push("Testando...");
                    this._messages.push("E mais uma vez testando...");
                    spriteFrameNames.push("child_idle_1.png");
                    spriteFrameNames.push("child_idle_2.png");
                    bgName = "castle.png";
                } else {
                    this._messages.push("Testando...");
                    this._messages.push("E mais uma vez testando...");
                    spriteFrameNames.push("child_idle_1.png");
                    spriteFrameNames.push("child_idle_2.png");
                    bgName = "castle.png";
                }
                break;
        }

        var bg = cc.Sprite.create(bgName);
        bg.setAnchorPoint(cc.p(0, 0));
        bg.setPosition(cc.p(0, 0));

        var character = cc.Sprite.createWithSpriteFrameName(spriteFrameNames[0]);
        character.setPosition(cc.p(winSize.width / 2, winSize.height / 2));

        this._textLabel = cc.LabelBMFont.create("", fnt_Dialogue, winSize - 40, cc.TEXT_ALIGNMENT_LEFT);
        this._textLabel.setAnchorPoint(cc.p(0, 1));
        this._textLabel.setPosition(cc.p(20, winSize.height - 30));

        this.addChild(bg);
        this.addChild(character);
        this.addChild(this._textLabel);

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
            cc.Director.getInstance().replaceScene(new StageScene(this._nextLevel));
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