/*global window*/
(function () {
    "use strict";

    function Sound() {
    }

    Sound.prototype.prepare = function () {
    };
    
    if (window.SoundManager === undefined) {
        window.SoundManager = {};
    }
    window.SoundManager.Sound = Sound;
}());