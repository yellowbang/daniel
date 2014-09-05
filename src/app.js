/*globals define*/
define(function(require, exports, module) {
    // import dependencies
    var Engine = require('famous/core/Engine');
    var mainContext = Engine.createContext();
    mainContext.setPerspective(800);

    var Daniel = require('app/Daniel');

    var daniel = new Daniel();

    mainContext.add(daniel);

});
