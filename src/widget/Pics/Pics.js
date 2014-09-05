define(function(require, exports, module) {
    // import dependencies
    var Surface = require('famous/core/Surface');
    var View = require('famous/core/View');
    var RenderNode = require('famous/core/RenderNode');
    var Modifier = require('famous/core/Modifier');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Transform = require('famous/core/Transform');
    var Scrollview = require('famous/views/Scrollview');

    var AppConstant = require('app/Constant');
    var PicsItem = require('widget/Pics/PicsItem');

    function Pics() {

        View.apply(this, arguments);

        _createPics.call(this);
    }

    Pics.prototype = Object.create(View.prototype);
    Pics.prototype.constructor = Pics;

    Pics.DEFAULT_OPTIONS = {
    };

    function _createPics() {
        this.scrollview = new Scrollview({
            direction: 0,
            margin: window.innerWidth * 2,
            paginated: true
        });

        this.pics = [];
        for (var i in this.PICS) {
            var pic = new PicsItem({model: this.PICS[i]});
            pic.picItem.pipe(this.scrollview);
            this.pics.push(pic)
        }
        this.scrollview.sequenceFrom(this.pics);
        this.add(this.scrollview);

    }

    Pics.prototype.PICS = [
        'pic1','pic2','pic3','pic4','pic5','pic6','pic7','pic8','pic9','pic10','pic11','pic12','pic13','pic14','pic15','pic16','pic17','pic18'
    ];


    module.exports = Pics;

});
