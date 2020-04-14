var client;
var clientId;

$( document ).ready(function() {
	retrieveSheet();
	setPageTitle();
	
	setInputListeners();
	
	generateUUID();
	
	if (typeof refreshPageDisplay === "function") {
		refreshPageDisplay();
	}
  
	$('#joinTable').click(joinTable);
	$('#export').click(exportPlayer);
	$('#import').change(importPlayer);
});

function joinTable() {
	var tableName = prompt("Table UUID", "");
	if(tableName != '') {
		message = new Paho.Message('join'+clientId);
		message.destinationName = 'GM'+tableName;
		if(client != undefined && client != "")
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
		var data = JSON.parse(reader.result);
		var error = '';
		
		if(data['charashee']['game'] != $('input#game').val()){
			error="game does not match.";
		}
		
		if(error == ''){
			data['charashee']['playerId']=$('input#playerId').val(); //Replace UUID field to keep the current connection
			var plPage = LZString.compressToEncodedURIComponent(JSON.stringify(data));
			var target=window.location.origin+window.location.pathname+"#"+plPage;
			window.location.href = target;
			window.location.reload(true);
		}else{
			alert("Character sheet is invalid, "+error);
		}
	};
	reader.readAsText(file);
}

function setInputListeners() {
	$("form.toSave :input").each(function(){
		var input = $(this); 
		input.unbind();
		input.change(function() {
			storeSheet(client, clientId);
			setPageTitle();
		});
	});
}


function setPageTitle() {
	var pageTitle = $('input#game').val();
	if($('input#player').val() != '')
		pageTitle = $('input#player').val() + " · " + pageTitle;
	if($('input#character').val() != '')
		pageTitle = $('input#character').val() + " · " + pageTitle;
	$(document).attr("title", pageTitle);
}

//If the Player has a UUID connect, otherwise create a UUID before connecting
function generateUUID() {
	clientId = $('#playerId').val();
	if(clientId == undefined || clientId == ''){
		//Generate UUID
		getUUID(function(res) {
			$('#playerId').val(res);
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
	try{
		client = new Paho.Client(location.hostname, 8899, clientId);
		
	// 	client.onConnectionLost = onConnectionLost;
		client.onMessageArrived = onMessageArrived;

		//Connect the client
		client.connect({
			onSuccess:onConnect,
			onFailure:onFailure,
			reconnect: true,
			useSSL: true
		});
	}catch(err){
		client = "";
		return;
	}
}

//Code executed on connection
function onConnect() {
	console.log("onConnect " + clientId);
	client.subscribe(clientId);
	storeSheet(client, clientId);
}

function onFailure() {
	console.log("Failed to connect");
	client="";
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