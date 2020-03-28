var client;
var clientId;

$( document ).ready(function() {
	retrieveSheet();
	
	createMQTTClient();

	setInputListeners();
  
//   $('#joinTable').click(joinTable);
	$('#export').click(exportfn);
});

// function joinTable() {
//   var tableName = prompt("Table UUID", "");
//   if(tableName != '') {
//     message = new Paho.Message('join'+clientId);
//     message.destinationName = 'GM'+tableName;
//     client.send(message);
//   }
// }

function setInputListeners() {
	$("form#charashee :input").each(function(){
		var input = $(this); 
		input.unbind();
		input.change(function() {
			storeSheet(client, clientId);
		});
	});
}

//Connect to MQTT
function createMQTTClient() {
	clientId = $('#uuid').val();
	if(clientId == undefined || clientId == '')
		clientId = Math.random()*100
	clientId =  'PL'+clientId
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