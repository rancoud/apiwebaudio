/*global window*/
(function() {
    "use strict";
    /*global AudioContext, webkitAudioContext, window*/
    var self = null,                        // instance pour le context
        audioContext,                       // objet de l'api audioContext
        audioContextSupported = false,      // boolean permettant de savoir si le navigateur supporte web audio api
        sounds = {};                        // un objets contenant un ensemble de sons

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
     * @return {Array} true si support de l'api, false, si pas de support de l'api
     */
    SoundManager.prototype.getSounds = function() {
        var soundsArray = [];

        for (var name in sounds) {
            soundsArray.push(name);
        }

        return soundsArray;
    };

    /**
     * Charge un son en requête XMLHttpRequest et le rajoute de manière asynchrone dans la variable globale sounds
     * @param  {String} name Label du son que l'on veut charger
     * @param  {String} url  Adresse à laquelle se trouve le son
     */
    SoundManager.prototype.loadSound = function(name, url) {
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
                        // on rajoute dans la variable globale le label, une version decodée de l'audio, ainsi qu'un tableau vide de nodes
                        sounds[name] = {
                            'buffer': buffer,
                            nodes: []
                        };
                    }
                );
            }
            else {
                sounds[name] = {
                    'buffer': '',
                    nodes: []
                };
            }
        };
        request.send();
    };

    SoundManager.prototype.play = function(name, timeBegin, timeEnding, loopFlag) {
        if (sounds.hasOwnProperty(name)) {
            if (self.isAudioContextSupported() === true) {
                self.playSound(name, timeBegin, timeEnding, loopFlag);
            }
            else {
                //
            }
        }
        else {
            console.log('???');
            setTimeout(
                function(){
                    self.play(name, timeBegin, timeEnding, loopFlag);
                },
                500
            );
        }
    };

    SoundManager.prototype.playSound = function(soundName, timeBegin, timeEnding, loopFlag) {
        var sourceNode = audioContext.createBufferSource(),
            countItem,
            i,
            nodeTemp = [];

        sourceNode.buffer = sounds[soundName].buffer;
        
        sourceNode.loop = (loopFlag === true);

        if (timeEnding !== undefined) {
            sourceNode.noteOff( audioContext.currentTime + timeEnding );
        }

        countItem = sounds[soundName].nodes.length;
        if (countItem === 0) {
            sourceNode.connect(audioContext.destination);
        }
        else {
            for (i = 0; i < countItem; i = i+1) {
                nodeTemp[i] = self.getNode(sounds[soundName].nodes[i][0],sounds[soundName].nodes[i][1]);

                if (i === 0) {
                    sourceNode.connect(nodeTemp[i]);
                }
                else {
                    nodeTemp[i-1].connect(nodeTemp[i]);
                }
            }

            nodeTemp[countItem-1].connect(audioContext.destination);
        }

        sourceNode.start(audioContext.currentTime + timeBegin);
    };

    if (window.SoundManager === undefined) {
        window.SoundManager = {};
    }
    window.SoundManager.SoundManager = SoundManager;
}());