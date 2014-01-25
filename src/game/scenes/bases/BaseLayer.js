
var BaseLayer = cc.Layer.extend({

    _winSize: null,
    _buttonATouchId: null,
    _buttonLeftTouchId: null,
    _buttonRightTouchId: null,

    _axisThreshold: 0.5,
    _axisUp: false,
    _axisDown: false,
    _axisLeft: false,
    _axisRight: false,
    _gamePadButtonDownFunction: null,
    _gamePadButtonUpFunction: null,
    _gamePadAxisChangedFunction: null,

    init:function () {
        this._super();

        this._winSize = cc.Director.getInstance().getWinSize();

        //this.setTouchEnabled(true);
        //this.setTouchMode(cc.TOUCH_ONE_BY_ONE);
        this.setKeyboardEnabled(true);

    },

    enableGamePad: function() {

        var self = this;

        this._gamePadButtonDownFunction = function(e) { self.onGamePadKeyDown(e); };
        this._gamePadButtonUpFunction = function(e) { self.onGamePadKeyUp(e); };
        this._gamePadAxisChangedFunction = function(e) { self.handleGamePadAxis(e); };

        gamePad.bind(Gamepad.Event.BUTTON_DOWN, this._gamePadButtonDownFunction);
        gamePad.bind(Gamepad.Event.BUTTON_UP, this._gamePadButtonUpFunction);
        gamePad.bind(Gamepad.Event.AXIS_CHANGED, this._gamePadAxisChangedFunction);

        for (var i = 0; i < gamePad.gamepads.length; i++) {
            var device = gamePad.gamepads[i];

            for (var control in device.state) {
                var value = device.state[control];

                if (/stick/i.test(control))
                    this.handleGamePadAxis({
                        axis: control,
                        value: value
                    });

                else if (value == 1)
                    this.handleGamePadKey({
                        control: control,
                        value: value
                    }, true);

            }

        }

    },

    disableGamePad: function() {

        gamePad.unbind(Gamepad.Event.BUTTON_DOWN, this._gamePadButtonDownFunction);
        gamePad.unbind(Gamepad.Event.BUTTON_UP, this._gamePadButtonUpFunction);
        gamePad.unbind(Gamepad.Event.AXIS_CHANGED, this._gamePadAxisChangedFunction);

        this._gamePadButtonDownFunction = null;
        this._gamePadButtonUpFunction = null;
        this._gamePadAxisChangedFunction = null;

    },

    onEnter: function() {
        this._super();

        this.enableGamePad();

    },

    onExit: function() {
        this._super();

        this.disableGamePad();

    },

    handleGamePadAxis: function(e) {

        var axisThreshold = this._axisThreshold;

        if (e.axis == "LEFT_STICK_X") {

            if (e.value >= axisThreshold && !this._axisRight) {
                this._axisRight = true;
                this.buttonRight(true);
            } else if (e.value < axisThreshold && this._axisRight) {
                this._axisRight = false;
                this.buttonRight(false);
            }

            if (e.value <= -axisThreshold && !this._axisLeft) {
                this._axisLeft = true;
                this.buttonLeft(true);
            } else if (e.value > -axisThreshold && this._axisLeft) {
                this._axisLeft = false;
                this.buttonLeft(false);
            }

        } else if (e.axis == "LEFT_STICK_Y") {

            if (e.value >= axisThreshold && !this._axisDown) {
                this._axisDown = true;
                this.buttonDown(true);
            } else if (e.value < axisThreshold && this._axisDown) {
                this._axisDown = false;
                this.buttonDown(false);
            }

            if (e.value <= -axisThreshold && !this._axisUp) {
                this._axisUp = true;
                this.buttonUp(true);
            } else if (e.value > -axisThreshold && this._axisUp) {
                this._axisUp = false;
                this.buttonUp(false);
            }

        }
    },

    handleGamePadKey: function(e, pressed) {

        switch (e.control) {
            case "DPAD_UP":
                this.buttonUp(pressed);
                break;
            case "DPAD_DOWN":
                this.buttonDown(pressed);
                break;
            case "DPAD_LEFT":
                this.buttonLeft(pressed);
                break;
            case "DPAD_RIGHT":
                this.buttonRight(pressed);
                break;
            case "FACE_1":
            case "FACE_3":
                this.buttonA(pressed);
                break;
            case "FACE_2":
            case "FACE_4":
                this.buttonB(pressed);
                break;
            case "START_FORWARD":
                this.buttonStart(pressed);
                break;
            case "SELECT_BACK":
                this.buttonSelect(pressed);
                break;
        }

    },

    onGamePadKeyDown: function (e) {
        this.handleGamePadKey(e, true);
    },

    onGamePadKeyUp: function (e) {
        this.handleGamePadKey(e, false);
    },

    recursivelyPauseAllChildren: function(node) {
        node.pauseSchedulerAndActions();

        var nodeChildren = node.getChildren();
        for (var c in nodeChildren) {
            this.recursivelyPauseAllChildren(nodeChildren[c]);
        }
    },

    recursivelyResumeAllChildren: function(node) {
        node.resumeSchedulerAndActions();

        var nodeChildren = node.getChildren();
        for (var c in nodeChildren) {
            this.recursivelyResumeAllChildren(nodeChildren[c]);
        }
    },

    onTouchesBegan: function (touches, event) {

        if (touches.length == 3) {
            this.buttonB(true);
            this.buttonB(false);
            return;
        }

        for (var t in touches) {
            var touch = touches[t];
            if (touch.getLocation().y > this._winSize.height / 2) {
                this._buttonATouchId = touch.getId();
                this.buttonA(true);
            } else {
                if (touch.getLocation().x < this._winSize.width / 2) {
                    if (this._buttonRightTouchId != null) {
                        this._buttonATouchId = touch.getId();
                        this.buttonA(true);
                    } else {
                        this._buttonLeftTouchId = touch.getId();
                        this.buttonLeft(true);
                    }
                } else {
                    if (this._buttonLeftTouchId != null) {
                        this._buttonATouchId = touch.getId();
                        this.buttonA(true);
                    } else {
                        this._buttonRightTouchId = touch.getId();
                        this.buttonRight(true);
                    }
                }
            }
        }

    },

    onTouchesMoved: function(touches, event){

    },

    onTouchesEnded: function (touches, event){

        for (var t in touches) {
            var touch = touches[t];

            if (touch.getId() == this._buttonATouchId) {
                this._buttonATouchId = null;
                this.buttonA(false);

            } else if (touch.getId() == this._buttonLeftTouchId) {
                this._buttonLeftTouchId = null;
                this.buttonLeft(false);

            } else if (touch.getId() == this._buttonRightTouchId) {
                this._buttonRightTouchId = null;
                this.buttonRight(false);
            }

        }

    },

    onTouchesCancelled: function (touches, event) {

        for (var t in touches) {
            var touch = touches[t];

            if (touch.getId() == this._buttonATouchId) {
                this._buttonATouchId = null;
                this.buttonA(false);

            } else if (touch.getId() == this._buttonLeftTouchId) {
                this._buttonLeftTouchId = null;
                this.buttonLeft(false);

            } else if (touch.getId() == this._buttonRightTouchId) {
                this._buttonRightTouchId = null;
                this.buttonRight(false);
            }

        }

    },

    onKeyDown: function(key) {
        this._handleKey(key, true);
    },

    onKeyUp: function(key) {
        this._handleKey(key, false);
    },

    _handleKey: function(key, pressed) {

        switch (key) {
            case cc.KEY.up:
            case cc.KEY.w:
                this.buttonUp(pressed); break;
            case cc.KEY.down:
            case cc.KEY.s:
                this.buttonDown(pressed); break;
            case cc.KEY.left:
            case cc.KEY.a:
                this.buttonLeft(pressed); break;
            case cc.KEY.right:
            case cc.KEY.d:
                this.buttonRight(pressed); break;
            case cc.KEY.z:
            case cc.KEY.k:
            case cc.KEY.escape:
                this.buttonB(pressed); break;
            case cc.KEY.x:
            case cc.KEY.l:
            case cc.KEY.space:
                this.buttonA(pressed); break;
            case cc.KEY.enter:
                this.buttonStart(pressed); break;
            case cc.KEY.backspace:
                this.buttonSelect(pressed); break;

            default: break;
        }

    },

    buttonUp: function(pressed) {
    },

    buttonDown: function(pressed) {
    },

    buttonLeft: function(pressed) {
    },

    buttonRight: function(pressed) {
    },

    buttonA: function(pressed) {
    },

    buttonB: function(pressed) {
    },

    buttonStart: function(pressed) {
    },

    buttonSelect: function(pressed) {
    }

});