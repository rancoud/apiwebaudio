(function() {
	"use strict";
	
	var soundManager = new window.sound.SoundManager();
	if(soundManager.isAudioContextSupported() === false){
		window.console.log('isAudioContextSupported === false');
	}

	soundManager.loadSound('snare', 'sound/Snare 06.wav');
	soundManager.loadSound('kick', 'sound/Kick 01.wav');
	soundManager.loadSound('ch', 'sound/CHH 02.wav');
	soundManager.loadSound('perk', 'sound/Perk 02.wav');

	function addEvent(obj, event, fct) {
		if (obj.attachEvent){
			obj.attachEvent("on" + event, fct);
		}else{
			obj.addEventListener(event, fct, false);
		}
	}

	function partitionTempoRandom() {
		var sound = soundManager.getSounds(),
			tempo = getRandomInt(80, 200), // BPM (beats per minute)
			eighthNoteTime = (60 / tempo) / 2,
			startTime = 0,
			bar,
			time,
			i;

		// le nombre de mesure
		for (bar = 0; bar < 2; bar = bar + 1) {
			time = startTime + bar * 8 * eighthNoteTime;
			
			// Play the bass (kick) drum on beats 1, 5
			soundManager.play('kick', time);
			soundManager.play('kick', time + 4 * eighthNoteTime);

			// Play the snare drum on beats 3, 7
			soundManager.play('snare', time + 2 * eighthNoteTime);
			soundManager.play('snare', time + 6 * eighthNoteTime);

			// Play the hi-hat every eighth note.
			for (i = 0; i < 8; ++i) {
				soundManager.play('ch', time + i * eighthNoteTime);
			}
		}
	}

	function partitionTempoRandomv2() {
		var sound = soundManager.getSounds(),
			tempo = getRandomInt(130, 200), // BPM (beats per minute)
			eighthNoteTime = (60 / tempo) / 2,
			startTime = 0,
			bar,
			time,
			i;

		// le nombre de mesure
		for (bar = 0; bar < 2; bar = bar + 1) {
			time = startTime + bar * 8 * eighthNoteTime;
			

			soundManager.play('kick', time + getRandomInt(0,8) * eighthNoteTime);
			soundManager.play('kick', time + getRandomInt(0,8) * eighthNoteTime);

			soundManager.play('snare', time + getRandomInt(0,8) * eighthNoteTime);
			soundManager.play('snare', time + getRandomInt(0,8) * eighthNoteTime);

			for (i = 0; i < 8; ++i) {
				if(getRandomInt(0,10) >= 3){
					soundManager.play('ch', time + i * eighthNoteTime);
				}
			}
		}
		setTimeout(partitionTempoRandomv2, (startTime + 2 * 8 * eighthNoteTime)*1000);
	}

	function partitionTempoRandomv3() {
		var sound = soundManager.getSounds(),
			tempo = getRandomInt(130, 240), // BPM (beats per minute)
			eighthNoteTime = (60 / tempo) / 2,
			startTime = 0,
			bar,
			time,
			i,
			j,
			hit;

		// le nombre de mesure
		for (bar = 0; bar < 2; bar = bar + 1) {
			time = startTime + bar * 8 * eighthNoteTime;
			
			hit = getRandomInt(0,8);
			for(j = 0; j < hit; j++) {
				soundManager.play('kick', time + getRandomInt(0,8) * eighthNoteTime);
			}

			hit = getRandomInt(0,8);
			for(j = 0; j < getRandomInt(0,8); j++) {
				soundManager.play('snare', time + getRandomInt(0,8) * eighthNoteTime);
			}

			for (i = 0; i < 8; ++i) {
				if(getRandomInt(0,10) >= 5){
					soundManager.play('ch', time + i * eighthNoteTime);
				}
				else {
					soundManager.play('perk', time + i * eighthNoteTime);
				}
			}
		}
		setTimeout(partitionTempoRandomv3, (startTime + 2 * 8 * eighthNoteTime)*1000);
	}

	/**
	 * Returns a random integer between min and max
	 * Using Math.round() will give you a non-uniform distribution!
	 */
	function getRandomInt(min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	/**
	 * Returns a random number between min and max
	 */
	function getRandomFloat(min, max) {
	    return Math.random() * (max - min) + min;
	}

	function drawSpectrum() {
		var canvas = document.getElementById('canvas');
		var ctx = canvas.getContext('2d');
		var width = canvas.width;
		var height = canvas.height;
		var bar_width = 10;

		ctx.clearRect(0, 0, width, height);

		var freqByteData = new Uint8Array(myAudioAnalyser.frequencyBinCount);
		myAudioAnalyser.getByteFrequencyData(freqByteData);

		var barCount = Math.round(width / bar_width);
		for (var i = 0; i < barCount; i++) {
			var magnitude = freqByteData[i];
			// some values need adjusting to fit on the canvas
			ctx.fillRect(bar_width * i, height, bar_width - 2, -magnitude + 60);
		}
	}

	function jouerChanson(){
		soundManager.play('chanson');
	}

	function record(){
		// success callback when requesting audio input stream
		function gotStream(stream) {
			window.AudioContext = window.AudioContext || window.webkitAudioContext;
			var audioContext = new AudioContext();

			// Create an AudioNode from the stream.
			var mediaStreamSource = audioContext.createMediaStreamSource( stream );

			// Add analyzer between
			var analyzer = audioContext.createAnalyser();

			// Connect it to the destination to hear yourself (or any other node for processing!)
			mediaStreamSource.connect( analyzer );
			analyzer.connect( audioContext.destination );

			setInterval(function(){
				var freqByteData = new Uint8Array(analyzer.frequencyBinCount);
				analyzer.getByteFrequencyData(freqByteData);


				var canvas = document.getElementById('canvas');
				var ctx = canvas.getContext('2d');
				var width = canvas.width;
				var height = canvas.height;
				var bar_width = 10;

				ctx.clearRect(0, 0, width, height);

				var freqByteData = new Uint8Array(analyzer.frequencyBinCount);
				analyzer.getByteFrequencyData(freqByteData);

				var barCount = Math.round(width / bar_width);
				for (var i = 0; i < barCount; i++) {
					var magnitude = freqByteData[i];
					// some values need adjusting to fit on the canvas
					ctx.fillRect(bar_width * i, height, bar_width - 2, -magnitude + 60);
				}
				/*
				var max = freqByteData.length;
				for (var i = 0; i < max; i++) {
					if(freqByteData[i] != 0){
						var freq = freqByteData[i] * 44100/analyzer.fftSize;
						if(freq >= 75 && freq <= 95){
							console.log(freqByteData[i] * 44100/analyzer.fftSize);
						}
					}
				};*/
			}, 50);
		}

		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
		navigator.getUserMedia( {audio:true}, gotStream, function(){ console.log('mic not open') } );
	}

	addEvent(document.getElementById('snare'), 'click', function(){soundManager.play('snare');});
	addEvent(document.getElementById('kick'), 'click', function(){soundManager.play('kick');});
	addEvent(document.getElementById('ch'), 'click', function(){soundManager.play('ch');});
	addEvent(document.getElementById('perk'), 'click', function(){soundManager.play('perk');});

	addEvent(document.getElementById('partitionTempoRandom'), 'click', function(){partitionTempoRandom();});
	addEvent(document.getElementById('partitionTempoRandomv2'), 'click', function(){partitionTempoRandomv2();});
	addEvent(document.getElementById('partitionTempoRandomv3'), 'click', function(){partitionTempoRandomv3();});

	addEvent(document.getElementById('jouerChanson'), 'click', function(){jouerChanson();});

	addEvent(document.getElementById('record'), 'click', function(){record();});
}());

/*
// can't addafter it
soundManager.addNode('ReverbNode', 'boom1', {});

soundManager.addNode('GainNode', 'boom1', {});
soundManager.addNode('CompressorNode', 'boom1', {});
soundManager.addNode('BiquadFilterNode', 'boom1', {});
soundManager.addNode('PannerNode', 'boom1', {});

// ERROR
soundManager.addNode('DelayNode', 'boom1', {});
soundManager.addNode('OscillatorNode', 'boom1', {});
*/