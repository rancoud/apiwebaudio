/*global window*/
(function(){
    "use strict";

    function TrackManager(sound, soundManager) { 
        this.sound = sound;
        this.nodeList = [];
        this.soundManager = soundManager;

        this.addNode(new window.SoundManager.GainNode());
    }

    TrackManager.prototype.play = function (timeBegin, timeEnding, loopFlag) {
        var sourceNode = this.soundManager.audioContext.createBufferSource();

        timeBegin = timeBegin || 0;

        sourceNode.buffer = this.sound.buffer;
        this.sound.sourcesNodes.push(sourceNode);

        sourceNode.loop = (loopFlag === true);

        if (timeEnding !== undefined) {
            sourceNode.stop(this.soundManager.audioContext.currentTime + timeEnding);
        }

        sourceNode.start(audioContext.currentTime + timeBegin);
    };

    TrackManager.prototype.addNode = function (node) {
        this.nodeList.push(node);
    };

    TrackManager.prototype.removeNode = function (node) {
        this.nodeList.pop();
    };

    TrackManager.prototype.getList = function () {
        return this.nodeList;
    };

    TrackManager.prototype.computeNodes = function(sourceNode) {
        var currentNode = sourceNode;

        for (var i = 0; i < this.nodeList.length; i++) {
            currentNode.connect(this.nodeList[i].node);
            currentNode = this.nodeList[i].node;
        };

        return currentNode;
    };

    TrackManager.prototype.setVolume = function (volumeValue) {
        this.nodeList[0].setVolume(volumeValue);
    };

    if (window.SoundManager === undefined) {
        window.SoundManager = {};
    }
    window.SoundManager.TrackManager = TrackManager;
})();