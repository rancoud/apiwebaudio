/*global window*/
(function(){
    "use strict";

    function AudioNode() { 
        SoundManager.NodeManager.call(this);
    }

    AudioNode.prototype = Object.create(SoundManager.Node.prototype);

    AudioNode.prototype.prepare = function () {
    };

    if (window.SoundManager === undefined) {
        window.SoundManager = {};
    }
    window.SoundManager.AudioNode = AudioNode;
})();