/*global window*/
(function () {
    "use strict";

    function Node() {
    }

    if (window.SoundManager === undefined) {
        window.SoundManager = {};
    }
    window.SoundManager.Node = Node;
}());