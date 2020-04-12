var client;
var clientId;

$( document ).ready(function() {
	retrieveSheet();
	generateTID();
	
	setPageTitle();

	setInputListeners();

	retrievePlayers();

	$('#addPlayer').click(createPlayer);
	$('#export').click(exportMaster);
	$('#import').change(importMaster);
});

function setInputListeners() {
	$("form.toSave :input").each(function(){
		var input = $(this); 
		input.unbind();
		input.change(function() {
			storeSheet();
			setPageTitle();
		});
	});
}

function setPageTitle() {
	var pageTitle = "Game Master" + " · " + $('input#game').val();
	if($('input#master').val() != '')
		pageTitle = $('input#master').val() + " · " + pageTitle;
	$(document).attr("title", pageTitle);
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

function retrievePlayers(){
	var charHashtag = window.location.hash.substr(1);
	if(charHashtag == undefined || charHashtag == ""){
		return;
	}
	var charData = LZString.decompressFromEncodedURIComponent(charHashtag);
	var data = JSON.parse(charData);
	
	var listOfPlayers = data.players;
	if(listOfPlayers != undefined && listOfPlayers != ""){
		for(player in listOfPlayers){
			var playerId=player;
			var playerContent=JSON.parse(listOfPlayers[player]);
			
			addPlayer(playerId, playerContent);
			fillPlayerSheet(player, listOfPlayers[player]);
		}
	}
}

//Connect one player
function connectToPlayer(player) {
	var channel = 'PL'+player;
	client.subscribe(channel);
// 	askForUpdate(channel);
}

function disconnectFromPlayer(player) {
	var channel = 'PL'+player;
	client.unsubscribe(channel);
}

//Listen to players update (called only on the first connection)
function addPlayerListeners() {
	$('form#players :input').each(function(i){
		var playerId = this.id;
		if(playerId != undefined && playerId != '') {
			connectToPlayer(playerId);
		}
	});
}

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
	getUUID(function(res){
		addPlayer(res);
		connectToPlayer(res);
	});
}

//Delete the player entry and disconnect
function removePlayer(playerId) {
	disconnectFromPlayer(playerId);
	
	var playerLine=document.getElementById(playerId);
	var playerLi=playerLine.parentNode;
	playerLi.parentNode.removeChild(playerLi);
	
	removePlayerElements(playerId);
	
	storeSheet();
}

//Create a new player line, provide it with a UUID
function addPlayer(playerId, playerContent) {
	if(playerContent == undefined || playerContent == ""){
		//Create player data
		var playerStruct = { charashee: { playerId: playerId } }; //TODO ROBUSTIFY/MAKE CROSS GAME
		var playerJSON = JSON.stringify(playerStruct);
	}else{
		var playerJSON = JSON.stringify(playerContent);
	}

	addPlayerElements(playerId, createPlayerLink(playerId, playerJSON));
	$("#players").append('<li><textarea id="'+playerId+'" name="'+playerId+'">'+playerJSON+'</textarea></li>');
}

function createPlayerLink(playerId, playerContent) {
	var playerEncoded = LZString.compressToEncodedURIComponent(playerContent);
	var target=window.location.origin+window.location.pathname.replace("gm", "pl")+"#"+playerEncoded;
	return target;
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
	storeSheet();
	addPlayerListeners();
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
	if(message.payloadString.startsWith('join')) {
		var player = message.payloadString.substr(6); //Remove 'joinPL' at the beginning
		addPlayer(player);
		fillPlayerSheet(player, message.payloadString);
	} else if(message.payloadString != 'request' && !message.payloadString.startsWith('join')) {
		var player = message.destinationName.substr(2); //Remove 'PL' at the beginning
		fillPlayerSheet(player, message.payloadString);
	}
}

function fillPlayerSheet(player, content){
	var playerCard = document.getElementById(player+"_card");
	if(playerCard == undefined || playerCard == ""){
		return;
	}

	//First update the player element
	var data=JSON.parse(content);
	for(var property in data){
		if(data.hasOwnProperty(property)){
			var index=property,value=data[property];
			if("object"==typeof value){
				var formElement = $("#"+player+"_"+index)[0]; //Why do I need a [0]
				if(formElement != undefined && formElement != ""){
					populate(formElement, value);
				}
			}
		}
	}
	
	//Then update the player stored field
	var playerSave = document.getElementById(player);
	playerSave.replaceChild(document.createTextNode(content), playerSave.childNodes[0]);

	//Update the player link with its data
	$("#"+player+"_link")[0].href=createPlayerLink(player, content);
	
	storeSheet();
}
