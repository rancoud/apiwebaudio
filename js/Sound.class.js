/*global window*/
(function () {
    "use strict";

    function Sound(name, url, buffer) {
        this.name = name;
        this.url = url;
        this.buffer = buffer;
        this.sourcesNodes = [];
        this.endSound = undefined;
        this.audioFallback = undefined;
    }

    Sound.prototype.stop = function () {
        for (var i = 0, max = this.sourcesNodes.length; i < max; i++) {
            this.sourcesNodes[i].stop();
        };
        this.sourcesNodes = [];
    };

    Sound.prototype.callEndSound = function () {
        if(this.endSound !== undefined) {
            this.endSound();
        }
    };

    Sound.prototype.setEndSound = function (endSound) {
        this.endSound = endSound;
    };

    Sound.prototype.setAudioFallback = function (useFallback) {
        if(useFallback !== true) {
            return;
        }

        this.audioFallback = document.createElement('audio');
        this.audioFallback.setAttribute('src', this.url); 
        this.audioFallback.setAttribute('preload', 'auto');
    };

    if (window.SoundManager === undefined) {
        window.SoundManager = {};
    }
    window.SoundManager.Sound = Sound;
}());





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