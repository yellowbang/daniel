define(function(require, exports, module) {
    var Wall = require("famous/physics/constraints/Wall");
    var AppConstant = require('app/Constant');

    function Walls(size, restitution, onContact){

        // size is based on the window size
        // plus number for bigger
        // minus for smaller

        function setWall(normal, distance, res, drift, co){
            return new Wall({
                normal: normal,
                distance: distance,
                restitution: res || restitution,
                drift: drift || 0,
                onContact: co || onContact
            })
        }
        this.wallDown = setWall([0,-1,0], window.innerHeight - AppConstant.iconSize*2 - AppConstant.headerSize);
        this.wallUp = setWall([0,1,0], 0 + size);
        this.wallRight = setWall([-1,0,0], window.innerWidth - AppConstant.iconSize/4);
        this.wallLeft = setWall([1,0,0], 0 - AppConstant.iconSize/4);
        this.wallBottom = setWall([0,0,1], -1 + size);

        this.walls = [this.wallUp,this.wallDown,this.wallLeft,this.wallRight];

    }

    module.exports = Walls;

});