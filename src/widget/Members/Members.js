define(function(require, exports, module) {
    // import dependencies
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var PhysicsEngine = require('famous/physics/PhysicsEngine');
    var Wall = require("famous/physics/constraints/Wall");
    var Drag = require("famous/physics/forces/Drag");
    var Collision = require("famous/physics/constraints/Collision");
    var Spring = require("famous/physics/forces/Spring");
    var VectorField = require("famous/physics/forces/VectorField");
    var Vector = require('famous/math/Vector');
    var GenericSync         = require('famous/inputs/GenericSync');
    var TouchSync           = require('famous/inputs/TouchSync');
    var MouseSync           = require('famous/inputs/MouseSync');
    var Transitionable      = require('famous/transitions/Transitionable');

    GenericSync.register({
        mouse : MouseSync,
        touch : TouchSync
    });

    var Walls = require('widget/Members/Walls');
    var BallWalls = require('widget/Members/BallWalls');
    var MemberItem = require('widget/Members/MemberItem');
    var AppConstant = require('app/Constant');

    function Members(options) {

        View.apply(this, arguments);

        _init.call(this);
        _createPhysics.call(this);
        _setMembers.call(this);
        _setBall.call(this);
        this.setupEvent();
    }

    Members.prototype = Object.create(View.prototype);
    Members.prototype.constructor = Members;

    Members.DEFAULT_OPTIONS = {
        size:[200,200]
    };


    function _init(){
        this.members = [];
        this.randomWord = AppConstant.randomWord;
    }

    function _createPhysics(){
        this.physicsEngine = new PhysicsEngine();
        this.walls = new Walls(0, AppConstant.wallRestitution, Wall.ON_CONTACT.REFLECT).walls;
        this.drag = new Drag({
            strength : AppConstant.dragStrength
        });
        this.collision = new Collision({
            restitution : AppConstant.collisionRestitution,
            drift: 1
        });
        this.collisionBall = new Collision({
            restitution : 0,
            slope: 10,
            drift: 1
        });
        this.spring1 = new Spring({
            dampingRatio : 1,
            forceFunction: Spring.FORCE_FUNCTIONS.FENE,
            length: 0,
            period: 600,
            anchor : new Vector(window.innerWidth/2, window.innerHeight/3, 700)
        });
        this.spring2 = new Spring({
            dampingRatio : 1,
            forceFunction: Spring.FORCE_FUNCTIONS.FENE,
            length: 0,
            period: 600,
            anchor : new Vector(window.innerWidth/2, window.innerHeight/3, 0)
        });
    }

    function _setMembers(){
        for (var i in this.MEMBERS){
            var member = this.MEMBERS[i];
            this.addItem(member)
        }
    }

    function _setMask(){

    }

    Members.prototype.addItem = function(model){
        var randomWordIndex = Math.floor(Math.random()*this.randomWord.length);
        model.description.push(this.randomWord[randomWordIndex]);
        this.randomWord.splice(randomWordIndex, 1);
        var item = new MemberItem({
            physicsEngine: this.physicsEngine,
            model: model,
            spring: this.spring1,
            resetSpring: this.spring2,
            collisionBall: this.collisionBall
        });
        this.members.push(item.particle);
        this.physicsEngine.attach(this.walls, item.particle);
        this.physicsEngine.attach(this.drag, item.particle);
        if (this.members.length > 1){
            this.physicsEngine.attach(this.collision,  _.first(this.members,this.members.length-1), _.last(this.members));
        }
        this.add(item);
    };

    function _setBall(){
        this.ballWalls = new BallWalls(0, AppConstant.wallRestitution, Wall.ON_CONTACT.REFLECT).walls;
        var item = new MemberItem({
            physicsEngine: this.physicsEngine,
            model: this.ball,
            mass: 0,
            collisionBall: this.collisionBall,
            isBall: true,
            initPos: AppConstant.ballInitPos,
            initVel: [0,0,0]
        });
        this.physicsEngine.attach(this.ballWalls, item.particle);
        this.physicsEngine.attach(this.drag, item.particle);
        this.physicsEngine.attach(this.collisionBall, this.members, item.particle);
        this.add(item);

        // Ball touch Event
        this.ballPos = new Transitionable(_.first(AppConstant.ballInitPos,2));

        this.ballSync  = new GenericSync(['mouse', 'touch']);

        item.icon.pipe(this.ballSync);


        this.ballSync.on('start', function() {
            this.ballPos.set([0,0]);
            this.initPos = this.ballPos.get()
        }.bind(this));

        this.ballSync.on('update', function(data) {
            this.ballPos.set(data.position);
        }.bind(this));

        this.ballSync.on('end', function(data) {
            this.ballPos.set(data.position);
            this.finalPos = this.ballPos.get();
            var dx = this.finalPos[0]-this.initPos[0];
            var dy = this.finalPos[1]-this.initPos[1];
            var dr = Math.sqrt(dx*dx + dy*dy)*2;
            item.particle.setVelocity([dx/dr, dy/dr, 0])
        }.bind(this));
    }

    Members.prototype.setupEvent = function(){

    };

    Members.prototype.ball = {
        "name": "ball"
    };

    Members.prototype.MEMBERS = [
        {
            "name":"Bon",
            "description": []
        },
        {
            "name":"Yin",
            "description": []
        },{
            "name":"Amy",
            "description": []
        },
        {
            "name":"Andy",
            "description": ['面惡心善']
        },{
            "name":"AK",
            "description": ['女神']
        },
        {
            "name":"Aries",
            "description": ['半個宅男']
        },{
            "name":"Berber",
            "description": ['智囊']
        },
        {
            "name":"Christy",
            "description": ['兵']
        },{
            "name":"Eddie",
            "description": ['chok', '扮哂chok', '小氣', '最中意贊自己靚仔', '最中意戴黑超']
        },
        {
            "name":"Hana",
            "description": []
        },{
            "name":"Janice",
            "description": []
        },
        {
            "name":"Jeremy",
            "description": []
        },{
            "name":"Kai",
            "description": []
        },
        {
            "name":"Kathy",
            "description": []
        },{
            "name":"Kevin",
            "description": ['搞事二人組之一']
        },
        {
            "name":"Maggie",
            "description": []
        },{
            "name":"Melanie",
            "description": ['溫柔']
        },
        {
            "name":"Melvin",
            "description": ['clorox', '口水多過茶']
        },{
            "name":"Michael",
            "description": ['灣區古巨基']
        },
        {
            "name":"Newman",
            "description": ['嚴肅']
        },{
            "name":"Philip",
            "description": []
        },
        {
            "name":"Rex",
            "description": []
        },{
            "name":"Ricci",
            "description": ['搞事二人組之二']
        },
        {
            "name":"Vincent",
            "description": ['訓教果時好危險']
        },{
            "name":"XiuWen",
            "description": []
        },
        {
            "name":"Yayu",
            "description": []
        },{
            "name":"Jason",
            "description": []
        },
        {
            "name":"Angle",
            "description": []
        }
    ];

    module.exports = Members;


});
