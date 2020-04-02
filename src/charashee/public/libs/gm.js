var client;
var clientId;

$( document ).ready(function() {
	retrieveSheet();
	
	setInputListeners();

	generateTID();

	$('#addPlayer').click(createPlayer);
	$('#export').click(exportMaster);
	$('#import').change(importMaster);
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

function exportMaster() {
	var filename = $('input#game').val() + "_GM";
	if($('input#master').val() != '')
		filename = filename + "_" + $('input#master').val();
	exportFile(filename);
}

function importMaster() {
	var file = document.getElementById('import').files[0];
	var reader = new FileReader();
	
	reader.onload = function(event) {
		var formElement = document.getElementById('charashee');
// 		console.log("Populate with "+reader.result);
		var data = JSON.parse(reader.result);
		//Verify that the game is valid, otherwise exit without modifying the sheet
		var error = '';
		
		if(data.game != $('input#game').val()){
			error="game does not match.";
		}
		if(data.tid == undefined || data.master == ''){
			error="missing or incorrect table number.";
		}
		
		if(error == ''){
			populate(formElement, data);
			
			generateTID();
		}else{
			alert("Game Master sheet is invalid, "+error);
		}
	};
	reader.readAsText(file);
}

//Connect one player
function connectToPlayer(player) {
	var channel = 'PL'+player;
	client.subscribe(channel);
	askForUpdate(channel);
}

function disconnectFromPlayer(player) {
	var channel = 'PL'+player;
	client.unsubscribe(channel);
}

//Listen to players update (called only on the first connection)
// function addPlayerListeners() {
// 	$('ul li input[name^="player"]').each(function(i){
// 		var content = $(this).val();
// 		if(content != undefined && content != '') {
// 			connectToPlayer(content);
// 		}
// 	});
// }

//Copy the string to clipboard
// function copyToClipboard(text) {
// 	var textArea = document.createElement("textarea");
// 	textArea.value = text;
// 	document.body.appendChild(textArea);
// 	textArea.select();
// 	document.execCommand("Copy");
// 	textArea.remove();
// }

//Detect the "Add Player" button, create the UUID and call the addPlayer
function createPlayer() {
	getUUID(addPlayer);
}

//Delete the player entry and disconnect
function removePlayer(player) {
	disconnectFromPlayer(player);
	
	removePlayerElements(player);
}

//Create a new player line, provide it with a UUID
function addPlayer(playerId) {
	//Create player data
	var playerStruct = { uuid: playerId };
	var playerJSON = JSON.stringify(playerStruct);
	var playerEncoded = LZString.compressToEncodedURIComponent(playerJSON);
	var target=window.location.origin+window.location.pathname.replace("gm", "pl")+"#"+playerEncoded;

	addPlayerElements(playerId, target);
	
	connectToPlayer(playerId);
}

//If the TID exists connect the MQTT, otherwise create the TID and start the connection
function generateTID() {
	clientId = $('#tid').val();
	if(clientId == undefined || clientId == ''){
		//Generate TID
		getUUID(function(res) {
			$('#tid').val(res);
			clientId = 'GM'+res;
			createMQTTClient();
		});
	}else{
		clientId =  'GM'+clientId
		createMQTTClient();
	}
}

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
	storeSheet(client, clientId);
//TODO REDO FOR ALL PLAYERS IN THE LIST 	addPlayerListeners();
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
		//TODO Here to fill the table content
		$('#'+message.destinationName.substr(2)+' .content').val(message.payloadString);
// 		storeSheet();
	} else if(message.payloadString.startsWith('join')) {
		var player = message.payloadString.substr(6); //Remove 'joinPL' at the beginning
		addPlayer(player);
	}
}