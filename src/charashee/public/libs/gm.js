var client;
var clientId;

$( document ).ready(function() {
	retrieveSheet();
	
	generateTID();

	$('#addPlayer').click(addPlayer);

	hideEmptyPlayers();

	setInputListeners();
// 	setChannelListener();

	$('#export').click(exportfn);
});

function setInputListeners() {
	$("form#charashee :input").each(function(){
		var input = $(this); 
		input.unbind();
		input.change(function() {
			storeSheet();
		});
	});
}

function hideEmptyPlayers() {
	$('ul li input[name^="player"]').each(function(i){
		var content = $(this).val();
		if(content == undefined || content == '') {
			$(this).parent().hide();
		}
	});
}

//Connect one player
function connectToPlayer(player) {
	var channel = 'PL'+player;
	client.subscribe(channel);
	askForUpdate(channel);
}

//Listen to palyers update (called only on the first connection)
function addPlayerListeners() {
	$('ul li input[name^="player"]').each(function(i){
		var content = $(this).val();
		if(content != undefined && content != '') {
			connectToPlayer(content);
		}
	});
}

//Create a new player line, provide it with a UUID
function addPlayer() {
	//Generate UUID
	getUUID(function(res) {
		//Add input to form
		var first = true;
		$('ul li input[name^="player"]').each(function(i){
			var content = $(this).val();
			if((content == undefined || content == '') && first) {
				first = false
				$(this).val(res);
				$(this).parent().show();
				setInputListeners();
				storeSheet();
				connectToPlayer(res);
			}
		});

	});
}

//If the TID exists connect the MQTT, otherwise create the TID and start the connection
function generateTID() {
	clientId = $('#tid').val();
	if(clientId == undefined || clientId == ''){
		//Generate TID
		getUUID(function(res) {
			$('#tid').val(res);
			$('#tid').trigger('change');
			clientId = 'GM'+res;
			createMQTTClient();
		});
	}else{
		clientId =  'GM'+clientId
		createMQTTClient();
	}
}

// function setChannelListener() {
// 	$('#tid').change( function () {
// 		clientId = 'GM'+$('#tid').val();
// 		client.subscribe(clientId);
// 	});
// }

//Calls the server to create a UUID
function getUUID(callback) {
	$.ajax({
		url: "/uuid"
	}).done(function(res) {
		callback(res);
	});
}

//Force player to send its character sheet
function askForUpdate(channel) {
	message = new Paho.Message('request');
	message.destinationName = channel;
	client.send(message);
}

//Connect to MQTT
function createMQTTClient() {
	client = new Paho.Client(location.hostname, 2883, clientId);

// 	client.onConnectionLost = onConnectionLost;
	client.onMessageArrived = onMessageArrived;

	// connect the client
	client.connect({onSuccess:onConnect, reconnect : true});
}

//When connected, warn the players and retrieve their sheet
function onConnect() {
	console.log("onConnect " + clientId);
	client.subscribe(clientId);
	addPlayerListeners();
	//TODO ? storeSheet(client, clientId);
}

//Called when the client loses its connection
// function onConnectionLost(responseObject) {
// 	if (responseObject.errorCode !== 0) {
// 		console.log("onConnectionLost:"+responseObject.errorMessage);
// 	}
// }

//Called when a message arrives
function onMessageArrived(message) {
	console.log("onMessageArrived:"+message.payloadString+' from: '+message.destinationName);
	if(message.payloadString != 'request' && !message.payloadString.startsWith('join')) {
		$('ul li input[name^="player"]').each(function(i){
			var content = $(this).val();
			if(content != undefined && content != '') {
				var dest = 'PL'+$(this).val();
				if(dest == message.destinationName) {
					$(this).parent().children().eq(1).val(message.payloadString);
					//TODO Here to fill the table content
					storeSheet();
				}
			}
		});
	} else if(message.payloadString.startsWith('join')) {
		var player = message.payloadString.substr(6);
		console.log(player);
		var first = true;
		$('ul li input[name^="player"]').each(function(i){
			var content = $(this).val();
			if((content == undefined || content == '') && first) {
				first = false
				$(this).val(player);
				$(this).parent().show();
				setInputListeners();
				storeSheet();
				var channel = 'PL'+player;
				client.subscribe(channel);
				askForUpdate(channel);
			}
		});
	}
}