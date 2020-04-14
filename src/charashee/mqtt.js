const ws = require('websocket-stream')
const aedes = require('aedes')()
const uuid = require('uuid')
const fs = require('fs')

const server_ports = require('./node_modules/server_ports.js');

if(process.env.CERT_PATH == undefined){
	console.log('Env variable CERT_PATH undefined. Necessary to create a SSL Websocket.');
	return 99;
}
console.log(process.env.CERT_PATH+"/fullchain.pem");

const wsSslPort = server_ports.getWebsocketPort();

let wsSslServer = require('https').createServer({
	key: fs.readFileSync(process.env.CERT_PATH+"/privkey.pem"),
	cert: fs.readFileSync(process.env.CERT_PATH+"/fullchain.pem"),
	requestCert: false, // client send their certificate
	rejectUnauthorized: true,
	ca: [ fs.readFileSync(process.env.CERT_PATH+"/fullchain.pem") ]
})
ws.createServer({
	server: wsSslServer
}, aedes.handle)
wsSslServer.listen(wsSslPort, "0.0.0.0", function () {
	console.log('MQTT websocket tls server listening on port', wsSslPort)
})

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
