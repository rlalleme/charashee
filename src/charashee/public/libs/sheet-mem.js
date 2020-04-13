const maxLength = 65000

function buildJSONContent() {
	var result={};
	
	$.each($("form.toSave"), function(){
		parent=this.id;
		if(result[parent]==undefined){
			result[parent]={};
		}
		
		//First build the list of all uniqu names (automatically removes field where the name is not set)
		var names=new Set();
		for(i = 0; i < this.elements.length; i++){
			element=this.elements.item(i);
			if(element.name != undefined && element.name != "")
				names.add(element.name);
		}
		
		for (let item of names) {
			var element=this.elements.namedItem(item);
			
			//Then prepare the value
			var value;
			switch(element.type||element[0].type){
				case"checkbox":
					value=element.checked;
					break;
				default:
					value=element.value;
					break;
			}
			result[parent][item]=value;
		}
	});
	return result;
}

// Save form state to hashtag
// If a client is provided, send an MQTT message. (Players should provide their client, the MJ should not (infinite loop))
function storeSheet(client, uuid) {
	//Grab all the form data and put it into an array.
	var result = buildJSONContent();
	
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
	var data;
	try{
		data = JSON.parse(charData);
	}catch(error){
		data=="";
		window.location.href=window.location.origin+window.location.pathname;
	}
	if(data == undefined || data == ""){
		return;
	}
	
	// Browse all containing elements (should all be forms)
	for(var property in data){
		if(data.hasOwnProperty(property)){
			var index=property,value=data[property];
			if("object"==typeof value){
				var formElement = document.getElementById(index);
				populate(formElement, value);
			}
		}
	}
}

function exportFile(filename) {
	var charHashtag = window.location.hash.substr(1);
	var charData = LZString.decompressFromEncodedURIComponent(charHashtag);
	var json = JSON.stringify(JSON.parse(charData), null, 2)

	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(json));
	element.setAttribute('download', filename+'.json');

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}