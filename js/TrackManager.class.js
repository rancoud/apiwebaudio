/*global window*/
(function(){
    "use strict";

    function TrackManager() { 
        this.nodeList = [];
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

    if (window.SoundManager === undefined) {
        window.SoundManager = {};
    }
    window.SoundManager.TrackManager = TrackManager;
})();