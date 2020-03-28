const maxLength = 65000

// Save form state to hashtag
function storeSheet(client, uuid) {
	//Grab all the form data and put it into an array.
	var result = {};
	$.each($('form#charashee :input').serializeArray(), function() {
		result[this.name] = this.value;
	});
	// Alert to show what's being saved for debugging purposes. Should be commented out in live
	// alert(JSON.stringify(result));
	// Convert array to JSON string which is then compressed to a text string that can be stored in the URI
	var data = JSON.stringify(result);
	var charData = LZString.compressToEncodedURIComponent(data);

	// Check total data length to make sure we're not going over the 2038 limit
	var totalLength = location.href.replace(location.hash,"").length + charData.length;
	if (totalLength > maxLength) {
		alert('Length of ' + totalLength + ' exceeds maximum '+maxLength+'. Remove some text and re-save to ensure your bookmark works!');
	}
    
	if(client != undefined && uuid != undefined && uuid != '') {
		message = new Paho.Message(data);
		message.destinationName = uuid;
		client.send(message);
	}

	// Put that string up into the hashtag 
	window.location.hash = charData;
}

// Read the hashtag data and use to populate form
function retrieveSheet() {
	// Load the hashtag into variable
	var charHashtag = window.location.hash.substr(1);
	// Decompress hashtag to json string
	var charData = LZString.decompressFromEncodedURIComponent(charHashtag);
	// Parse JSON data
	var data = JSON.parse(charData);
	// Set your containing element
	var formElement = document.getElementById('charashee');
	// populate the form with our JSON object
	populate(formElement, data);
}

function exportFile(filename) {
	var charHashtag = window.location.hash.substr(1);
	var charData = LZString.decompressFromEncodedURIComponent(charHashtag);

	console.log(charData);
	
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(charData));
	element.setAttribute('download', filename+'.json');

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}