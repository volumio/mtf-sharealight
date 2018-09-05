const  osc = require("osc");
const os = require("os");
const express = require('express');
const app = express();
const colors = require('colors');
const PowerMate = require('node-powermate');
const cors = require('cors');
const io = require('socket.io')(4111);


//VARIABLES
const paletteSize = 36;
var colorPalette = new Array(paletteSize);
var clients = 0;
var colorPalettePosition = paletteSize/2;


// Start our http server on port 3000
startServer();

createPalette();

readFromPowerMate();


function startServer() {

    console.log('Starting HTTP Server'.green);

    app.use(express.static(__dirname + '/http/'))
    app.listen(3000);
    app.use(cors());

    io.on('connection', function (socket) {
        clients = clients + 1;
        console.log('A client connected, total: ' + clients);

        socket.on('disconnect', function() {
            clients = clients - 1;
            console.log('A client disconnected, total: ' + clients);
        })
    });
}

function readFromPowerMate(){
    const powermate = new PowerMate();
    console.log('Listening on power mate events'.green);

    powermate.on('buttonDown', function() {
        console.log('button')
        sendColor('#000000')
    });

    powermate.on('wheelTurn', function(delta) {

        if (delta < 0) {
            colorPalettePosition = colorPalettePosition - 1;
            if (colorPalettePosition < 0) {
                colorPalettePosition = paletteSize;
            }
        } else {
            colorPalettePosition = colorPalettePosition + 1;
            if (colorPalettePosition > paletteSize) {
                colorPalettePosition = 0;
            }
        }

        //console.log(colorPalette[colorPalettePosition])
        sendColor(colorPalette[colorPalettePosition])
        //io.emit('color',  colorPalette[colorPalettePosition]);
    });
}

function createPalette() {
    for (var i=0; i< paletteSize; i++) {
        var red   = sin_to_hex(i, 0 * Math.PI * 2/3); // 0   deg
        var blue  = sin_to_hex(i, 1 * Math.PI * 2/3); // 120 deg
        var green = sin_to_hex(i, 2 * Math.PI * 2/3); // 240 deg

        colorPalette[i] = "#"+ red + green + blue;
    }

    function sin_to_hex(i, phase) {
        var sin = Math.sin(Math.PI / paletteSize * 2 * i + phase);
        var int = Math.floor(sin * 127) + 128;
        var hex = int.toString(16);

        return hex.length === 1 ? "0"+hex : hex;
    }
    //console.log(colorPalette)
}

function hexToRgb(hex) {
    try {
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
    } catch(e) {
        console.log('ERR!')
    }

}

function sendColor(color) {
    var hex = hexToRgb(color);
    try {
        var hexMessage = 'rgb(' + hex.r +', ' + hex.g +', ' + hex.b +')';
        io.emit('color',  hexMessage);
    } catch(e) {
        console.log('ERR!')
    }

}