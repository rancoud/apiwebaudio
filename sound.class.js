(function() {
    "use strict";
    /*global AudioContext, webkitAudioContext*/
    var analyzer;
    var self = null,                        // instance pour le context
        audioContext,                       // objet de l'api audioContext
        audioContextSupported = false,      // boolean permettant de savoir si le navigateur supporte web audio api
        sounds = {};                        // un objets contenant un ensemble de sons

    /**
     * Constructeur de la classe
     */
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
        var soundsArray = new Array();

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
    SoundManager.prototype.loadSound = function( name, url ) {
        var request = new XMLHttpRequest();

        request.open("GET", url, true);
        // c'est une obligaton de la documentation d'utiliser un responseType en arraybuffer
        request.responseType = "arraybuffer";

        // calback de la requête en asynchrone
        request.onload = function() {
            if (self.isAudioContextSupported) {
                // au moment de la réponse on demande au contexte de décoder l'audio
                audioContext.decodeAudioData( request.response,
                    function(buffer) {
                        // on ra joute dans la variable globale le label, une version decodée de l'audio, ainsi qu'un tableau vide de nodes
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

    SoundManager.prototype.play = function( name, timeBegin, timeEnding, loopFlag ) {
        if (sounds.hasOwnProperty(name)) {
            if (self.isAudioContextSupported() === true) {
                self.playSound(name, timeBegin, timeEnding, loopFlag);
            }
            else {
                //
            }
        }
        else {
            setTimeout(function(){self.play(name, timeBegin, timeEnding, loopFlag);},500);
        }
    };

    SoundManager.prototype.playSound = function( soundName, timeBegin, timeEnding, loopFlag ) {
        var sourceNode = audioContext.createBufferSource(),
            countItem,
            i, javascriptNode, 
            nodeTemp = [];

        sourceNode.buffer = sounds[soundName].buffer;
        
        if (loopFlag === true) {
            sourceNode.loop = true;
        }
        else {
            sourceNode.loop = false;
        }

        if (timeEnding !== undefined) {
            sourceNode.noteOff( audioContext.currentTime + timeEnding );
        }

        countItem = sounds[soundName].nodes.length;
        if (countItem === 0) {
/*
            javascriptNode = self.getJavascriptNode();
            javascriptNode.connect( audioContext.destination );
            self.analyser = self.getAnalyzerNode();

            javascriptNode.onaudioprocess = function() {
                var canvas = document.getElementById('canvas');
                var ctx = canvas.getContext('2d');
                var width = canvas.width;
                var height = canvas.height;
                var bar_width = 10;

                ctx.clearRect(0, 0, width, height);

                var freqByteData = new Uint8Array(self.analyser.frequencyBinCount);
                self.analyser.getByteFrequencyData(freqByteData);
                
                var max = freqByteData.length;
                for ( var i = 0; i < max; ++i ){
                    var value = freqByteData[i];
                    ctx.fillRect(i*5,600-value,3,600);
                }
            }
*/

            //sourceNode.connect(audioContext.destination);
            //self.analyser.connect(javascriptNode);

            sourceNode.connect(audioContext.destination);
        }
        else {
            for (i = 0; i < countItem; i = i+1) {
                nodeTemp[i] = self.getNode(sounds[soundName].nodes[i][0],sounds[soundName].nodes[i][1]);

                if (i === 0) {
                    sourceNode.connect( nodeTemp[i] );
                }
                else {
                    nodeTemp[i-1].connect(nodeTemp[i]);
                }
            }

            nodeTemp[countItem-1].connect( audioContext.destination );
        }

        sourceNode.start( audioContext.currentTime + timeBegin );
    };

    SoundManager.prototype.getJavascriptNode = function() {
        return audioContext.createJavaScriptNode(2048, 1, 1);
    };

    SoundManager.prototype.getAnalyzerNode = function() {
        var analyserNode = audioContext.createAnalyser();
        analyserNode.smoothingTimeConstant = 0.3;
        analyserNode.fftSize = 1024;
        return analyserNode;
    };

    SoundManager.prototype.getSourceNode = function() {
        return audioContext.createBufferSource();
    };

    SoundManager.prototype.getBiquadFilterNode = function() {
        var biquadFilterNode = audioContext.createBiquadFilter();

        biquadFilterNode.frequency.value = 440.0;
        biquadFilterNode.Q.value = 1.0;
        biquadFilterNode.gain.value = 1.0;

        return biquadFilterNode;
    };

    SoundManager.prototype.getWaveShaperNode = function() {
        return audioContext.createWaveShaper();
    };

    SoundManager.prototype.getPannerNode = function() {
        var pannerNode = audioContext.createPanner();

        pannerNode.setPosition(0, 0, 0);
        pannerNode.setOrientation(0, 0, 0, 0, 0, 0);
        pannerNode.setVelocity(0, 0, 0);

        return pannerNode;
    };

    SoundManager.prototype.getCompressorNode = function() {
        var compressorNode = audioContext.createDynamicsCompressor();

        compressorNode.threshold.value = -24.0;
        compressorNode.knee.value = 20.0;
        compressorNode.ratio.value = 12.0;
        compressorNode.attack.value = 0.003;
        compressorNode.release.value = 0.25;

        return compressorNode;
    };

    SoundManager.prototype.getDelayNode = function(nameSound) {
        var delayNode = audioContext.createDelayNode();

        delayNode.delayTime.value = 0.2;

        return delayNode;
    };

    SoundManager.prototype.getReverbNode = function(nameSound) {
        var convolver;

        convolver = audioContext.createConvolver();
        convolver.buffer = sounds[nameSound].buffer;

        return convolver;
    };

    SoundManager.prototype.getGainNode = function(nameSound) {
        var gainNode = audioContext.createGainNode();

        gainNode.gain.value = 1.0;
        gainNode.buffer = sounds[nameSound].buffer;

        return gainNode;
    };

    SoundManager.prototype.getOscillatorNode = function() {
        var oscillatorNode = audioContext.createOscillator();

        oscillatorNode.oscillatorFrequency = 440;
        oscillatorNode.oscillatorDetune = 0;
        oscillatorNode.oscillatorType = 0;

        return oscillator;
    };

    SoundManager.prototype.addNode = function(nodeType, nameSound, parameters) {
        if (sounds.hasOwnProperty(nameSound) && self.isAudioContextSupported() === true) {
            sounds[nameSound].nodes.push([nodeType,[nameSound], parameters]);
        }
    };

    SoundManager.prototype.deleteNode = function(nodeType, nameSound, offset) {
        var i, countItem, tempArray = [];

        if (sounds.hasOwnProperty(nameSound)) {
            countItem = sounds[nameSound].nodes.length;
            for (i=0; i<countItem;i=i+1) {
                if (sounds[nameSound].nodes[i][0] !== nodeType) {
                    tempArray.push(sounds[nameSound].nodes[i]);
                }
            }
            sounds[nameSound].nodes = tempArray;
        }
    };

    SoundManager.prototype.setNodesChaining = function(nameSound){
        if (sounds.hasOwnProperty(nameSound)) {
            //sounds[nameSound].nodes = 
        }
    };

    SoundManager.prototype.getNode = function(nodeType, parameters){
        var node;

        switch (nodeType) {
            case "BiquadFilterNode":
                node = self.getBiquadFilterNode(parameters);
            break;

            case "CompressorNode":
                node = self.getCompressorNode(parameters);
            break;

            case "GainNode":
                node = self.getGainNode(parameters);
            break;

            case "PannerNode":
                node = self.getPannerNode(parameters);
            break;

            case "ReverbNode":
                node = self.getReverbNode(parameters);
            break;

            case "WaveShaperNode":
                node = self.getWaveShaperNode(parameters);
            break;
        }

        return node;
    };

    if( window.sound === undefined) {
        window.sound = {};
    }
    window.sound.SoundManager = SoundManager;

}());