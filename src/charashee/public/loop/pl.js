var client;
var clientId;

$( document ).ready(function() {
	retrieveFromURL();
//   createMQTTClient();
	setInputListeners();
//   setChannelListener();
  
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
			storeIntoURL(client, clientId);
		});
	});
}

// function setChannelListener() {
//   $('#uuid').change( function () {
//     clientId = 'PL'+$('#uuid').val();
//     client.subscribe(clientId);
//   });
// }

// function createMQTTClient() {
//   clientId = $('#uuid').val();
//   if(clientId == undefined || clientId == '')
//     clientId = Math.random()*100
//   clientId =  'PL'+clientId
//   client = new Paho.Client(location.hostname, 2883, clientId);
//   
//   client.onConnectionLost = onConnectionLost;
//   client.onMessageArrived = onMessageArrived;
// 
//   // connect the client
//   client.connect({onSuccess:onConnect, reconnect : true});
// }
// 
// function onConnect() {
//   console.log("onConnect " + clientId);
//   client.subscribe(clientId);
//   putCharstuff(client, clientId);
//   
// }
// 
// // called when the client loses its connection
// function onConnectionLost(responseObject) {
//   if (responseObject.errorCode !== 0) {
//     console.log("onConnectionLost:"+responseObject.errorMessage);
//   }
// }
// 
// // called when a message arrives
// function onMessageArrived(message) {
//   console.log("onMessageArrived:"+message.payloadString);
//   if(message.payloadString == 'request') {
//     putCharstuff(client, clientId);
//   }
// }