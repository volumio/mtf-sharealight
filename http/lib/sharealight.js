var currentColor = '#000000';
var sweepDuration = 10;
var socket = io('http://10.37.101.115:4111');

socket.on('connect', function(){
    console.log('Connected to server');
    colorSweep('#0000FF');
});

socket.on('color', function(data){
    colorSweep(data);
});

socket.on('disconnect', function(){
    console.log('Disconnected from Server')
});

function colorSweep(color) {
    if (color) {
        console.log('Sweeping to ' + color);
        var hex = hexToRgb(color);
        //console.log(hex)
        //console.log('rgb(' + hex.r +', ' + hex.g +', ' + hex.b +')')
        document.body.style.backgroundColor = 'rgb(' + hex.r +', ' + hex.g +', ' + hex.b +')';
    }
}

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}