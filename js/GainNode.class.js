/*global window*/
(function(){
    "use strict";

    function GainNode() { 
        SoundManager.Node.call(this);
        this.node = window.SoundManager.audioContext.createGain();

        this.setVolume(1);
    }

    GainNode.prototype = Object.create(SoundManager.Node.prototype);

    GainNode.prototype.setVolume = function (volumeValue) {
        this.node.gain.value = volumeValue;
    };

    if (window.SoundManager === undefined) {
        window.SoundManager = {};
    }
    window.SoundManager.GainNode = GainNode;
})();