/*global window*/
(function () {
    "use strict";

    function Sound(name, buffer) {
    	this.name = name;
    	this.buffer = buffer;
    }

    Sound.prototype.prepare = function () {
    };
    
    if (window.SoundManager === undefined) {
        window.SoundManager = {};
    }
    window.SoundManager.Sound = Sound;
}());