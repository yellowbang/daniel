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
        randomWord:['擁有200磅未來肌肉', '興趣:洗碗', '一大舊腹肌', '擅長用腳趾撩鼻','被睡過的床都下陷了','靚鞋搭對穿窿襪', '喜歡用手指刷牙',
            '世界因為我而陸沉', '省港澳雀王', '瘦過張柏芝', '爛GAG王', '有梦想的人', '吃薯片多個吃齋', '比猩猩還誠實', '老人精',
            '大細路', '社交無能手', '以為自己最有型', '講遍天下無敵手', '隱者般的存在感', '生意能手', '講到做到', '兩斜插刀 信用夠高',
            '在宇宙盡頭也找不到的好人', '24小時扮忙', '自怕狂', 'Uno draw 4 聖手', '輕輕跳兩下就可以產生地震', '北半球哎交王', 'High Hand']
    }

});