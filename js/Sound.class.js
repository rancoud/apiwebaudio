/*global window*/
(function () {
    "use strict";

    function Sound(name, url, buffer) {
        this.name = name;
        this.url = url;
        this.buffer = buffer;
    }
/*
    Sound.prototype.play = function (audioContext, timeBegin, timeEnding, loopFlag) {
        this.sourceNode = audioContext.createBufferSource();

        this.sourceNode.buffer = this.buffer;

        this.sourceNode.connect(audioContext.destination);

        this.sourceNode.loop = (loopFlag === true);

        if (timeEnding !== undefined) {
            this.sourceNode.noteOff( audioContext.currentTime + timeEnding );
        }

        this.sourceNode.start( audioContext.currentTime + timeBegin );
    };

    Sound.prototype.stop = function () {
    };

    Sound.prototype.setVolume = function () {
    };

    Sound.prototype.isPlayed = function () {
    };
*/
    if (window.SoundManager === undefined) {
        window.SoundManager = {};
    }
    window.SoundManager.Sound = Sound;
}());