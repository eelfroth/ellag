window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var sounds = {};

function loadSound(name, url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
        context.decodeAudioData(request.response, function(buffer) {
            sounds[name] = buffer;
        });
    }
    request.send();
}

function playSound(buffer, volume = 1, panx = 0) {
    var source = context.createBufferSource();
    var gain = context.createGain();
    var pan = context.createPanner();
    source.buffer = buffer;
    source.connect(gain);
    gain.connect(pan);
    pan.connect(context.destination);

    gain.gain.value = volume;
    pan.setPosition(panx, 0, 0);

    source.start(0);
}
