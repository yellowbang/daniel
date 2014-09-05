define(function(require, exports, module) {

    var Spring = require('famous/physics/forces/Spring');

    module.exports = {

        scale: 4,
        title: 'Daniel Fellowship',
        headerSize: window.innerHeight/6,
        headerWordSize: window.innerWidth/30,
        headerWordSpacing: window.innerWidth/30,
        wallRestitution : 1,
        iconSize: window.innerHeight/14,
        memberContentSize: window.innerHeight/100,
        ballInitPos: [0.5 * window.innerWidth, window.innerHeight - Math.min(window.innerHeight,window.innerWidth)/14-window.innerHeight/6,0],
        dragStrength: 0.000,
        collisionRestitution: 0.000000000000,
        picSize: [window.innerWidth, window.innerHeight-window.innerHeight/6],
        randomWord:['280磅', '興趣:洗碗', '一舊腹肌']
    }

});