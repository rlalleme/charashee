var client;
var clientId;

$( document ).ready(function() {
	retrieveSheet();
	
	generateUUID();

	setInputListeners();
  
	$('#joinTable').click(joinTable);
	$('#export').click(exportPlayer);
	$('#import').change(importPlayer);
});

function joinTable() {
	var tableName = prompt("Table UUID", "");
	if(tableName != '') {
		message = new Paho.Message('join'+clientId);
		message.destinationName = 'GM'+tableName;
		client.send(message);
	}
}

function exportPlayer() {
	var filename = $('input#game').val();
	if($('input#player').val() != '')
		filename = filename + "_" + $('input#player').val();
	if($('input#character').val() != '')
		filename = filename + "_" + $('input#character').val();
	exportFile(filename);
}

function importPlayer() {
	var file = document.getElementById('import').files[0];
	var reader = new FileReader();
	
	reader.onload = function(event) {
		var formElement = document.getElementById('charashee');
// 		console.log("Populate with "+reader.result);
		var data = JSON.parse(reader.result);
		delete data.uuid; //Remove UUID field to keep the current connection
		//Verify that the game is valid, otherwise exit without modifying the sheet
		if(data.game == $('input#game').val()){
			populate(formElement, data);
			
			generateUUID();
		}else{
			alert("Character sheet is invalid, game does not match");
		}
	};
	reader.readAsText(file);
}

function setInputListeners() {
	$("form#charashee :input").each(function(){
		var input = $(this); 
		input.unbind();
		input.change(function() {
			storeSheet(client, clientId);
		});
	});
}

//If the Player has a UUID connect, otherwise create a UUID before connecting
function generateUUID() {
	clientId = $('#uuid').val();
	if(clientId == undefined || clientId == ''){
		//Generate UUID
		getUUID(function(res) {
			$('#uuid').val(res);
			clientId = 'PL'+res;
			createMQTTClient();
		});
	}else{
		clientId =  'PL'+clientId
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

//Connect to MQTT
function createMQTTClient() {
	client = new Paho.Client(location.hostname, 2883, clientId);

// 	client.onConnectionLost = onConnectionLost;
	client.onMessageArrived = onMessageArrived;

	//Connect the client
	client.connect({onSuccess:onConnect, reconnect : true});
}

//Code executed on connection
function onConnect() {
	console.log("onConnect " + clientId);
	client.subscribe(clientId);
	storeSheet(client, clientId);
}

// //Called when the client loses its connection
// function onConnectionLost(responseObject) {
// 	if (responseObject.errorCode !== 0) {
// 		console.log("onConnectionLost:"+responseObject.errorMessage);
// 	}
// 	//TODO
// }

//Called when a message arrives
function onMessageArrived(message) {
	console.log("onMessageArrived:"+message.payloadString);
	if(message.payloadString == 'request') {
		storeSheet(client, clientId);
	}
}