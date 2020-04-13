const ws = require('websocket-stream');
const aedes = require('aedes')()
const uuid = require('uuid');

const server_ports = require('./node_modules/server_ports.js');

//Get WebSocket port from environment
var wsPort = server_ports.getWebsocketPort();

// Ws server
var wsServer = require('http').createServer();
ws.createServer({
	server: wsServer
}, aedes.handle);

wsServer.listen(wsPort, "0.0.0.0", function () {
	console.log('MQTT websocket server listening on port ', wsPort)
});

const express = require('express')
const app = express()
app.use(express.static('public'))
app.use('/', express.static('public/index.html'));

app.get('/UUID', function (req, res) {
	res.send(uuid.v4())
})

//Get WebSocket port from environment
var serverPort = server_ports.getWebServerPort();
console.log('Web server listening on port ', serverPort);
app.listen(serverPort)
