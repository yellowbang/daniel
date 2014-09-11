define(function(require, exports, module) {
    var Engine = require('famous/core/Engine');
    var View = require('famous/core/View');
    var RenderNode = require('famous/core/RenderNode');
    var RenderController = require('famous/views/RenderController');
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');

    var SoundPlayer = require('widget/SoundPlayer/SoundPlayer');

    var AppConstant = require('app/Constant');
    var Members = require('widget/Members/Members');
    var Pics = require('widget/Pics/Pics');

    function Daniel(){

        window.Daniel = this;
        View.call(this);
        _init.call(this);
//        _setupEvents.call(this);

    }

    Daniel.prototype = Object.create(View.prototype);
    Daniel.prototype.constructor = Daniel;

    function _init(){
        _setLayout.call(this);
        this.background = new Surface({
            size: [undefined, undefined],
            classes: ['app-background'],
            content: ['<div class="icon">',
            '<img src="/assets/pics/pic1.jpg" height="100%" width="100%">',
            '</div>'].join('')
        });
        this.backgroundMod = new Modifier({
            transform: Transform.translate(0,0,-2)
        });
        this.layout.content.add(this.backgroundMod).add(this.background);
        _setHeader.call(this);
        _setContent.call(this);
        _setInfo.call(this);

    }

    function _setLayout(){
        this.layout = new HeaderFooterLayout({
            headerSize: AppConstant.headerSize,
            footerSize: 0
        });
        this.add(this.layout);
    }

    function _setHeader(){
        this.headerNode = new RenderNode();
        this.headerNodeMod = new Modifier({
            size: [AppConstant.title.length*AppConstant.headerWordSpacing,AppConstant.headerSize],
            origin: [0.5, 0.5],
            align: [0.5,0.7]
        });
        this.layout.header.add(this.headerNodeMod).add(this.headerNode);
        for (var i in AppConstant.title){
            this.addHeader(AppConstant.title[i], i)
        }
        _createPicButton.call(this);
    }

    function _setContent() {
        this.members = new Members();
        this.pics = new Pics();
        this.picsController = new RenderController();
        this.layout.content.add(this.picsController);
        this.picsController.show(this.members);
    }

    function _createPicButton(){
        this.picButton1 = new Surface({
            size: [AppConstant.headerSize*0.5,AppConstant.headerWordSize],
            content: '<div class="pic-button pic-button1"> Pics </div>'
        });
        this.picButton2 = new Surface({
            size: [AppConstant.headerSize*0.5,AppConstant.headerWordSize],
            content: '<div class="pic-button pic-button2"> Back </div>'
        });
        this.picButton2Mod = new Modifier({
            transform: Transform.thenMove(Transform.rotateY(Math.PI),[0,0,-0.1])
        });

        this.picButtonNode = new RenderNode();
        this.picButtonNodeMod = new Modifier({
            origin:[1,0.5]
        });
        this.layout.header.add(this.picButtonNodeMod).add(this.picButtonNode);
        this.picButtonNode.add(this.picButton1);
        this.picButtonNode.add(this.picButton2Mod).add(this.picButton2);

        this.picButton1.on('click', function(){
            this.picButtonNodeMod.setTransform(Transform.rotateY(Math.PI),{duration:400});
            this.picsController.show(this.pics);
        }.bind(this));
        this.picButton2.on('click', function(){
            this.picButtonNodeMod.setTransform(Transform.rotateY(0),{duration:400});
            this.picsController.show(this.members);
        }.bind(this));
    }

    function _setInfo(){
        this.address = new Surface({
            content: '<div class="info" style="font-size: '+AppConstant.iconSize/3+'px">' +
                '<div class="info"><a target="_blank" href="http://maps.google.com/?q=1150 Vicente Street San Francisco CA">' +
                '<div style="float: right; color: rgb(248, 186, 43);">1150 Vicente Street</div>' +
                '<div style="color: rgb(248, 186, 43); font-size: '+ AppConstant.iconSize/3.5 +'px">San Francisco, CA 94116</div>' +
                '</a></div>' +
                '<div><a target="_blank" href="http://www.sfcac.org/" style="float: right; color: rgb(236, 159, 42);"> More Info </a></div></div>',
            size: [true, AppConstant.iconSize]
        });
        this.addressMod = new Modifier({
            origin: [1, 1],
            transform: Transform.translate(-20, -0.03*window.innerHeight,0)
        });
        this.add(this.addressMod).add(this.address);
    }

    Daniel.prototype.addHeader = function(word, index){
        var headerItem = new Surface({
            content: '<div class="header-word" style="font-size:'+AppConstant.headerWordSize+'px">'+word+'</div>',
            size: [AppConstant.headerWordSize, AppConstant.headerWordSize],
            properties: {
                color: 'hsl(' + (0.7 + index/AppConstant.title.length*0.3) * 360 + ',100%,88%)'
            }
        });
        var headerItemMod = new Modifier({
            transform: Transform.translate(index*(AppConstant.headerWordSpacing),0,0)
        });
        this.headerNode.add(headerItemMod).add(headerItem);
    };

    function _setupEvents(){
        this.members.collisionBall.on('collision',function(e){
            console.log(e)
        }.bind(this))
    }

    module.exports = Daniel;

});