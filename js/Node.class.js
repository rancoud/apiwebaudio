/*global window*/
(function () {
    "use strict";

    function Node() {
    }

    Node.prototype.prepare = function (callback) {
    };
    
    if (window.SoundManager === undefined) {
        window.SoundManager = {};
    }
    window.SoundManager.Node = Node;
}());