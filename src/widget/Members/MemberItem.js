define(function(require, exports, module) {
    // import dependencies
    var Surface = require('famous/core/Surface');
    var View = require('famous/core/View');
    var RenderNode = require('famous/core/RenderNode');
    var RenderController = require('famous/views/RenderController');
    var Modifier = require('famous/core/Modifier');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Transform = require('famous/core/Transform');
    var Particle = require('famous/physics/bodies/Particle');
    var Circle = require('famous/physics/bodies/Circle');
    var Drag = require('famous/physics/forces/Drag');
    var Vector = require('famous/math/Vector');
    var Spring = require("famous/physics/forces/Spring");
    var Easing = require('famous/transitions/Easing');
    var Wall = require("famous/physics/constraints/Wall");
    var Timer = require('famous/utilities/Timer');

    var ShakingItemView = require('widget/ShakingItemView');
    var AppConstant = require('app/Constant');

    function MemberItem(options) {
        window.TT = Transform;
        this.model = options.model;
        this.physicsEngine = options.physicsEngine;
        this.spring = options.spring;
        this.spring2 = options.resetSpring;
        this.collisionBall = options.collisionBall;
        this.options = options;
        View.apply(this, arguments);

        _createMemberIcon.call(this);
        _createParticle.call(this);
        _setupEvents.call(this);
    }

    MemberItem.prototype = Object.create(View.prototype);
    MemberItem.prototype.constructor = MemberItem;

    MemberItem.DEFAULT_OPTIONS = {
        isBall: false
    };

    function _createMemberIcon(){
        this.contentSurf = new Surface({
            size: [AppConstant.iconSize*AppConstant.scale,AppConstant.iconSize*AppConstant.scale],
            classes:['see-back'],
            content: this.setContent(),
            properties:{
                fontSize:'12px',
                color: 'black',
                background: '#333',
                borderRadius: AppConstant.iconSize/2*AppConstant.scale+'px'
            }
        });
        this.contentSurfMod = new StateModifier({
            transform:Transform.thenMove(Transform.rotateY(Math.PI),[0,0,-0.1])
        });
        this.contentSurfScaleMod = new StateModifier({
            transform:Transform.scale(1/AppConstant.scale, 1/AppConstant.scale,1)
        });
        this.contentNode = new RenderNode();
        this.contentNode.add(this.contentSurfScaleMod).add(this.contentSurfMod).add(this.contentSurf);
        this.contentSurfController = new RenderController();

        this.backgroundSurf = new Surface({
            size: [AppConstant.iconSize,AppConstant.iconSize],
            classes:['see-back'],
            properties:{
                background: '#333',
                borderRadius: AppConstant.iconSize/2*AppConstant.scale+'px'
            }
        });
        this.backgroundSurfMod = new StateModifier({
            transform:Transform.translate(0,0,-0.05)
        });
        this.icon = new Surface({
            size: [AppConstant.iconSize*AppConstant.scale,AppConstant.iconSize*AppConstant.scale],
            classes:['icon'],
            content: this.setIconPic()
        });
        this.iconScaleMod = new Modifier({
            transform:Transform.scale(1/AppConstant.scale, 1/AppConstant.scale,1)
        });
        this.nodee = new RenderNode();
        this.nodee.add(this.contentSurfController);
        this.nodee.add(this.backgroundSurfMod).add(this.backgroundSurf);
        this.nodee.add(this.iconScaleMod).add(this.icon);
        this.iconMod = new StateModifier();
        this.iconMod2 = new StateModifier();
        this.iconMod3 = new StateModifier();
        this.iconMod4 = new StateModifier();
        this.iconMod5 = new StateModifier();
        this.shakeNode = new ShakingItemView({item:this.nodee, shakeAngle: 0.05})
    }

    function _createParticle(){

        var pos = this.options.initPos || [Math.random()*window.innerWidth, Math.random()*window.innerHeight, 0];
        var vel = this.options.initVel || [Math.random()-0.5,Math.random()-0.5];
        this.particle = new Circle({
            radius: AppConstant.iconSize/2,
            position: new Vector(pos),
            velocity: new Vector(vel)
        });
        this.physicsEngine.addBody(this.particle);
        this.add(this.particle).add(this.iconMod5).add(this.iconMod4).add(this.iconMod3).add(this.iconMod2).add(this.iconMod).add(this.shakeNode);
        _setBottomAndTopWalls.call(this);
    }

    function _setBottomAndTopWalls(){
        this.bottomWall = new Wall({
            normal: [0,0,1],
            distance: -1,
            restitution: 1,
            drift: 0,
            onContact: 0
        });
        this.physicsEngine.attach(this.bottomWall, this.particle);

        this.topWall = new Wall({
            normal: [0,0,-1],
            distance: 1,
            restitution: 0,
            drift: 0,
            onContact: 0
        });
        this.topWallID = this.physicsEngine.attach(this.topWall, this.particle);
    }

    function _setupEvents(){
        this.mode = 0;
        this.collisionBall.on('collision', function(event){
            if (event.target == this.particle || event.source == this.particle)
                this.nextMode();
        }.bind(this));
        this.icon.on('click', function(){
            if (this.mode != 0)
                this.nextMode()
        }.bind(this));
        this.contentSurf.on('click', this.nextMode.bind(this));
        this.bottomWall.on('collision', function(){
            this.particle.setVelocity(this.particle.getVelocity()[0],this.particle.getVelocity()[1],0);
        }.bind(this))
    }

    MemberItem.prototype.onHit = function(){
        if (this.topWallID) {
            this.physicsEngine.detach(this.topWallID);
            this.topWallID = 0;
        }
        this.springID1 = this.physicsEngine.attach(this.spring, this.particle);
        var transition = {
            duration: 600,
            curve: Easing.OutQuad
        };
        this.shakeNode.hault();
        this.iconMod.setTransform(Transform.rotateY(Math.PI),transition);
        this.iconMod2.setTransform(Transform.rotateY(Math.PI),transition);
        this.iconMod3.setTransform(Transform.rotateY(Math.PI),transition);
        this.iconMod4.setTransform(Transform.rotateY(Math.PI),transition);
    };

    MemberItem.prototype.onflip = function(){
        var transition = {
            duration: 600,
            curve: Easing.InExpo
        };
        this.iconMod5.setTransform(Transform.rotateY(Math.PI),transition);
        this.contentSurfController.show(this.contentNode);
    };


    MemberItem.prototype.reset = function(){
        if (this.springID1)
            this.physicsEngine.detach(this.springID1);
        this.springID2 = this.physicsEngine.attach(this.spring2, this.particle);
        Timer.setTimeout(function(){
            this.physicsEngine.detach(this.springID2);
            this.particle.setVelocity([Math.random()-0.5,Math.random()-0.5,0]);
//            this.topWallID = this.physicsEngine.attach(this.topWall, this.particle);  // if set, an reset item will not collide with the other items.
        }.bind(this),1300);
        var transition = {
            duration: 600,
            curve: Easing.OutQuad
        };
        this.iconMod.setTransform(Transform.rotateY(0),transition);
        this.iconMod2.setTransform(Transform.rotateY(0),transition);
        this.iconMod3.setTransform(Transform.rotateY(0),transition);
        this.iconMod4.setTransform(Transform.rotateY(0),transition);

        var transition2 = {
            duration: 1000,
            curve: Easing.easeOutExpo
        };
        this.iconMod5.setTransform(Transform.rotateY(0),transition2);
        this.contentSurfController.hide();
        this.shakeNode.shake();
    };
    
    MemberItem.prototype.setIconPic = function(){
        return ['<div class="icon">',
            '<img src="assets/img/', this.model.name, '.jpg" style="border-radius: ', AppConstant.iconSize*AppConstant.scale, 'px">',
            '</div>'].join('')
    };

    MemberItem.prototype.setContent = function(){
        var content = ['<div class="member-content" style="border-radius: ', AppConstant.iconSize, 'px; font-size:', AppConstant.memberContentSize, 'px">',
            '<div class="name" style="font-size:', AppConstant.memberContentSize + 10, 'px">', this.model.name, '</div>'];
        for (var i in this.model.description){
            content.push(['<div class="description" style="color: hsl(' + (0.6 + i/this.model.description.length*0.2) * 360 + ',100%,88%); font-size:', AppConstant.memberContentSize + 10, 'px">',
                this.model.description[i],
                '</div>'].join(''));
        }
        content.push('</div>');
        return content.join('')
    };

    MemberItem.prototype.nextMode = function(){
        if (this.options.isBall){
            this.resetBall();
            return
        }
        this.mode = (this.mode+1)%3;
        switch (this.mode) {
            case 1:
                this.onHit();
                break;
            case 2:
                this.onflip();
                break;
            case 0:
                this.reset();
                break;
        }
    };

    MemberItem.prototype.resetBall = function() {
        this.particle.setVelocity(0,0);
        this.particle.setPosition(AppConstant.ballInitPos);
        var ballSpring = new Spring({
            dampingRatio : 1,
            forceFunction: Spring.FORCE_FUNCTIONS.HOOK,
            length: 0,
            period: 1000,
            anchor : new Vector(AppConstant.ballInitPos)
        });
        var ballSpringID = this.physicsEngine.attach(ballSpring, this.particle);
        Timer.setTimeout(function(){
            this.physicsEngine.detach(ballSpringID);
            this.particle.setVelocity([0,0,0]);
        }.bind(this),2000);
    };

    module.exports = MemberItem;

});
