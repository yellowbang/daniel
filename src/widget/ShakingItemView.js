define(function(require, exports, module){
    var Transform      = require('famous/core/Transform');
    var Modifier       = require('famous/core/Modifier');
    var Transitionable = require('famous/transitions/Transitionable');
    var View           = require('famous/core/View');
    var StateModifier  = require('famous/modifiers/StateModifier')
    var Easing = require('famous/transitions/Easing');

    var SnapTransition = require('famous/transitions/SnapTransition');
    Transitionable.registerMethod('snap', SnapTransition);


    function HoverItemView(options) {
        View.apply(this, arguments);
        this.initialTime = Date.now() * Math.random();

        if(options && typeof options.shakeAngle !== undefined) shakeAngle = options.shakeAngle;
        if(options && typeof options.shakeAngle !== undefined) deltaZ = options.deltaZ;
        this.add(_createShakeMod.call(this, this.options.shakeAngle)).add(this.options.item);
    }

    HoverItemView.prototype = Object.create(View.prototype);
    HoverItemView.prototype.constructor = HoverItemView;

    HoverItemView.DEFAULT_OPTIONS = {
        shakeAngle : 0.1,
        deltaZ : 20,
        item : undefined
    };

    function _createShakeMod(){
        this.shakeMod = new Modifier({
            origin: [.5,.5],
            align:[0,0]
        });
        var shakeState = new Transitionable(0);
        this.shakeMod.transformFrom(function (){return Transform.rotateZ(shakeState.get())});
        this.shake();
        return this.shakeMod;
    }

    HoverItemView.prototype.hault = function(){
        this.shakeMod.transformFrom(function (){return Transform.rotateZ(0)})
    };
    
    HoverItemView.prototype.shake = function(){
        this.shakeMod.transformFrom(
            function(){
                return Transform.rotateZ(shakeAngle * Math.sin((Date.now() - this.initialTime)/100));
            }.bind(this));
    };

    module.exports = HoverItemView;
});
