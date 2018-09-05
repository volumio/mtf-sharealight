var currentColor = '#000000';
var sweepDuration = 10;
var socket = io('http://10.37.101.115:4111');

socket.on('connect', function(){
    console.log('Connected to server');
    colorSweep('#000000');
});

socket.on('color', function(data){
    colorSweep(data);
});

socket.on('disconnect', function(){
    console.log('Disconnected from Server')
});

function colorSweep(color) {
    if (color) {
        //console.log('Sweeping to ' + color);
        //console.log(hex)
        //console.log('rgb(' + hex.r +', ' + hex.g +', ' + hex.b +')')
        document.body.style.backgroundColor = color;
    }
}

