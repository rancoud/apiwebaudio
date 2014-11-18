/*global window*/
(function(){
    "use strict";

    function GainNode() { 
        SoundManager.NodeManager.call(this);
    }

    GainNode.prototype = Object.create(SoundManager.Node.prototype);

    GainNode.prototype.beforeTransitionShow = function () {
    };

    if (window.SoundManager === undefined) {
        window.SoundManager = {};
    }
    window.SoundManager.GainNode = GainNode;
})();