/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

 http://www.cocos2d-x.org


 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
(function () {
    var d = document;
    var c = {
        COCOS2D_DEBUG:0, //0 to turn debug off, 1 for basic debug, and 2 for full debug
        box2d:false,
        chipmunk:false,
        showFPS:true,
        loadExtension:false,
        frameRate:60,
        renderMode:1,       //Choose of RenderMode: 0(default), 1(Canvas only), 2(WebGL only)
        tag:'gameCanvas', //the dom element to run cocos2d on
        engineDir:'cocos2d/',
        //SingleEngineFile:'',
        appFiles:[
            'src/libs/box2d/box2d.js',
            'src/libs/box2d/box2dExtract.js',
            'src/libs/box2d/box2d-addOn.js',
            'src/libs/box2d/box2d-debugDraw.js',
            'src/libs/gamepad/gamepad.min.js',
            'src/game/globals/functions.js',
            'src/game/globals/common.js',
            'src/game/globals/resource.js',
            'src/game/globals/GamePad.js',
            'src/game/globals/ContactListener.js',
            'src/game/entities/bases/GameObject.js',
            'src/game/entities/bases/Abstract.js',
            'src/game/entities/bases/Actor.js',
            'src/game/entities/bases/Collectible.js',
            'src/game/entities/bases/Enemy.js',
            'src/game/entities/collectibles/Bone.js',
            'src/game/entities/abstracts/LevelEnd.js',
            'src/game/entities/Player.js',
            'src/game/nodes/HUDLayer.js',
            'src/game/scenes/bases/BaseLayer.js',
            'src/game/scenes/Stage.js',
            'src/game/scenes/Dialogue.js',
            'src/game/scenes/MainScene.js'
        ]
    };

    if(!d.createElement('canvas').getContext){
        var s = d.createElement('div');
        s.innerHTML = '<h2>Your browser does not support HTML5 canvas!</h2>' +
            '<p>Google Chrome is a browser that combines a minimal design with sophisticated technology to make the web faster, safer, and easier.Click the logo to download.</p>' +
            '<a href="http://www.google.com/chrome" target="_blank"><img src="http://www.google.com/intl/zh-CN/chrome/assets/common/images/chrome_logo_2x.png" border="0"/></a>';
        var p = d.getElementById(c.tag).parentNode;
        p.style.background = 'none';
        p.style.border = 'none';
        p.insertBefore(s);

        d.body.style.background = '#ffffff';
        return;
    }


    window.addEventListener('DOMContentLoaded', function () {
		
        //first load engine file if specified
        var s = d.createElement('script');
        /*********Delete this section if you have packed all files into one*******/
        if (c.SingleEngineFile && !c.engineDir) {
            s.src = c.SingleEngineFile;
        }
        else if (c.engineDir && !c.SingleEngineFile) {
            s.src = c.engineDir + 'platform/jsloader.js';
        }
        else {
            alert('You must specify either the single engine file OR the engine directory in "cocos2d.js"');
        }
        /*********Delete this section if you have packed all files into one*******/

            //s.src = 'myTemplate.js'; //IMPORTANT: Un-comment this line if you have packed all files into one

        d.body.appendChild(s);
        document.ccConfig = c;
        s.id = 'cocos2d-html5';
        //else if single file specified, load singlefile
    });
    
    var externalCanvasUpdate = function () {

    	setTimeout(function() {
/*
            if (screen) {

                var baseHeight = 320;

                /*
                var sWidth = screen.width;
                var sHeight = screen.height;

                if (sWidth < sHeight) {
                //if (window.orientation != 0) {
                    sWidth = screen.height;
                    sHeight = screen.width;
                }
                */
/*
                var w = window,
                    d = document,
                    e = d.documentElement,
                    g = d.getElementsByTagName('body')[0],
                    sWidth = w.innerWidth || e.clientWidth || g.clientWidth,
                    sHeight = w.innerHeight|| e.clientHeight|| g.clientHeight;

                sWidth = Math.round(sWidth * (baseHeight / sHeight));
                console.log(sWidth);
                console.log(sHeight);
                document.getElementById("viewport").setAttribute("content",
                    "width=" + sWidth + ", height=" + baseHeight + ", user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, target-densitydpi=device-dpi");
            }
*/
    		var theCanvas = document.getElementById('gameCanvas');

			var ctx = theCanvas.getContext("2d");
			ctx.imageSmoothingEnabled = false;
			ctx.webkitImageSmoothingEnabled = false;
            ctx.mozImageSmoothingEnabled = false;
            ctx.oImageSmoothingEnabled = false;

		}, 0);
    };
    
    //window.addEventListener('load', externalCanvasUpdate);
    //window.addEventListener('resize', externalCanvasUpdate);
    //window.addEventListener('orientationchange', externalCanvasUpdate);
    
})();
