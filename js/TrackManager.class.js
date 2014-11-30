/*global window*/
(function(){
    "use strict";

    function TrackManager(sound) { 
        this.sound = sound;
        this.nodeList = [];

        this.addNode(new window.SoundManager.GainNode());
    }

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