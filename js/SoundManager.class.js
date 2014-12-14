/*global window*/
(function() {
    "use strict";
    /*global AudioContext, webkitAudioContext, window*/
    var self = null,                        // instance pour le context
        audioContext,                       // objet de l'api audioContext
        audioContextSupported = false,      // boolean permettant de savoir si le navigateur supporte web audio api
        tracks = [],                        // un tableau contenant une liste d'objet Sound
        countSoundLoaded = 0,               // nombre de sons chargé
        gainNode = undefined;               // controle du volume general

    function SoundManager() {
        // passage de l'instance courante à la variable globale de notre objet
        self = this;
        // initialisation de la classe avec mémorisation du résultat
        audioContextSupported = self.initialisation();
    }

    /**
     * Permet de déterminer si le navigateur supporte l'api web audio
     * @return {Boolean} true si support de l'api, false, si pas de support de l'api
     */
    SoundManager.prototype.initialisation = function() {
        if (typeof AudioContext !== 'undefined') {
            // version officiel W3C
            audioContext = new AudioContext();
        }
        else if (typeof webkitAudioContext !== 'undefined') {
            // version Webkit
            audioContext = new webkitAudioContext();
        }
        else {
            // aucun support
            return false;
        }

        // api web audio supportée, la variable audioContext est initialisé
        window.SoundManager.audioContext = audioContext;
        this.gainNode = new window.SoundManager.GainNode(); 
        return true;
    };

    /**
     * Permet d'interroger l'état de la variable sur le support de l'api web audio
     * @return {Boolean} true si support de l'api, false, si pas de support de l'api
     */
    SoundManager.prototype.isAudioContextSupported = function() {
        return audioContextSupported;
    };
    
    /**
     * Permet de récupérer la liste des sons
     * @return {Array} 
     */
    SoundManager.prototype.getSoundsName = function() {
        var soundsArray = [];

        for (var i = 0; i < countSoundLoaded; i++) {
            soundsArray.push(tracks[i].sound.name);
        }

        return soundsArray;
    };

    /**
     * Charge un son en requête XMLHttpRequest et le rajoute de manière asynchrone dans la variable globale sounds
     * @param  {String} name Label du son que l'on veut charger
     * @param  {String} url  Adresse à laquelle se trouve le son
     * @param  {String} success  Callback pour le chargemenent fini
     * @param  {String} error  Callback pour l'erreur
     */
    SoundManager.prototype.loadSound = function(name, url, success, error) {
        var request = new XMLHttpRequest();

        request.open("GET", url, true);
        // c'est une obligaton de la documentation d'utiliser un responseType en arraybuffer
        request.responseType = "arraybuffer";

        // calback de la requête en asynchrone
        request.onload = function() {
            if (self.isAudioContextSupported) {
                // au moment de la réponse on demande au contexte de décoder l'audio
                audioContext.decodeAudioData(
                    request.response,
                    function(buffer) {
                        // on rajoute dans la variable globale le label, une version decodée de l'audio
                        var sound = new window.SoundManager.Sound(name, url, buffer);
                        tracks.push(new window.SoundManager.TrackManager(sound));
                        countSoundLoaded++;

                        //callback
                        if (success) {
                            success();
                        }
                    }
                );
            }
            else {
                // TODO : FALLBACK
            }
        };
        request.send();
    };

    SoundManager.prototype.play = function(name, timeBegin, timeEnding, loopFlag) {
        if (self.isAudioContextSupported() === true) {
            for (var i = 0; i < countSoundLoaded; i++) {
                if (tracks[i].sound.name == name) {
                    self.playSound(i, timeBegin, timeEnding, loopFlag);
                }
            }
        }
        else {
            // TODO : FALLBACK
        }
    };

    SoundManager.prototype.playSound = function(soundIndice, timeBegin, timeEnding, loopFlag) {
        var sourceNode = audioContext.createBufferSource(),
            countItem,
            i,
            nodeTemp = [];

        timeBegin = timeBegin || 0;

        sourceNode.buffer = tracks[soundIndice].sound.buffer;

        sourceNode.loop = (loopFlag === true);

        if (timeEnding !== undefined) {
            sourceNode.stop(audioContext.currentTime + timeEnding);
        }

        /*countItem = sounds[soundIndice].nodes.length;
        if (countItem === 0) {*/
            //sourceNode.connect(audioContext.destination);
            tracks[soundIndice].computeNodes(sourceNode).connect(this.gainNode.node);
            this.gainNode.node.connect(audioContext.destination);
            // le mettre sur le sound ou sur le track ? ou les deux par ordre ?
            // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext
            sourceNode.onended = function() {
                console.log('source ended event');
            }
        /*}
        else {
            for (i = 0; i < countItem; i = i+1) {
                nodeTemp[i] = self.getNode(sounds[soundIndice].nodes[i][0],sounds[soundIndice].nodes[i][1]);

                if (i === 0) {
                    sourceNode.connect(nodeTemp[i]);
                }
                else {
                    nodeTemp[i-1].connect(nodeTemp[i]);
                }
            }

            nodeTemp[countItem-1].connect(audioContext.destination);
        }*/

        sourceNode.start(audioContext.currentTime + timeBegin);
    };

    SoundManager.prototype.setGeneralVolume = function(volumeValue) {
        if (self.isAudioContextSupported() === true) {
            this.gainNode.setVolume(volumeValue);
        }
        else {
            // TODO : FALLBACK
        }
    };

    SoundManager.prototype.setSoundVolume = function(soundName, volumeValue) {
        if (self.isAudioContextSupported() === true) {
            for (var i = 0; i < countSoundLoaded; i++) {
                if (tracks[i].sound.name == soundName) {
                    tracks[i].setVolume(volumeValue);
                }
            }
        }
        else {
            // TODO : FALLBACK
        }
    };

    SoundManager.prototype.addTrackManager = function(trackManager) {
        tracks.push(trackManager);
    };

    if (window.SoundManager === undefined) {
        window.SoundManager = {};
    }
    window.SoundManager.SoundManager = SoundManager;
}());