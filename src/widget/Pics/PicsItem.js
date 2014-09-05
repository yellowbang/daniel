define(function(require, exports, module) {
    // import dependencies
    var Surface = require('famous/core/Surface');
    var View = require('famous/core/View');
    var RenderNode = require('famous/core/RenderNode');
    var Modifier = require('famous/core/Modifier');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Transform = require('famous/core/Transform');

    var AppConstant = require('app/Constant');

    function PicsItem(options) {

        this.model = options.model;
        this.options = options;
        View.apply(this, arguments);

        _createPicsItem.call(this);
    }

    PicsItem.prototype = Object.create(View.prototype);
    PicsItem.prototype.constructor = PicsItem;

    PicsItem.DEFAULT_OPTIONS = {
    };

    function _createPicsItem(){
        this.picItem = new Surface({
            size: AppConstant.picSize,
            content: this.setPic()
        });
        this.picItemMod = new Modifier({
            origin: [0.5, 0.5]
        });
        this.add(this.picItemMod).add(this.picItem)
    }

    PicsItem.prototype.setPic = function(){
        return ['<div class="pic">',
            '<img src="/assets/pics/', this.model,'.jpg"/>',
            '</div>'].join('')
    };


    module.exports = PicsItem;

});
