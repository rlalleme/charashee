function addPlayerElements(playerId, playerLink) {
	//Create player display
// 	var playerCard = document.createElement("div");
// 	playerCard.setAttribute("class", "card w-25 m-1");
// // 	playerCard.setAttribute("id", playerId);
// // 	$('div#players').append(playerCard);
// 	
// 	pc_body = document.createElement("form");
// 	pc_body.setAttribute("class", "card-body");
// 	pc_body.setAttribute("id", playerId);
// 	playerCard.appendChild(pc_body);
// 	
// 	pc_title = document.createElement("h4");
// 	pc_title.setAttribute("class", "card-title character");
// 	pc_title.appendChild(document.createTextNode("Character One"));
// 	pc_body.appendChild(pc_title);
// 	
// 	pc_player = document.createElement("input");
// 	pc_player.setAttribute("class", "card-text w-100");
// 	pc_player.setAttribute("name", "player");
// 	pc_player.setAttribute("type", "text");
// 	pc_player.setAttribute("readonly", "true");
// 	pc_player.setAttribute("placeholder", "Player");
// 	pc_body.appendChild(pc_player);
// 	
// // 	pc_hp = document.createElement("progress");
// // 	pc_hp.setAttribute("class", "w-100 progress-bar");
// // 	pc_hp.setAttribute("max", 100);
// // 	pc_hp.setAttribute("value", 70);
// // 	pc_body.appendChild(pc_hp);
// 	
// 	pc_life = document.createElement("p");
// 	pc_life.setAttribute("class", "card-text text-center");
// 	pc_body.appendChild(pc_life);
// 	
// 	pc_hp = document.createElement("input");
// 	pc_hp.setAttribute("name", "hp");
// 	pc_hp.setAttribute("class", "hp_field");
// 	pc_hp.setAttribute("type", "number");
// 	pc_hp.setAttribute("readonly", "true");
// 	pc_hp.setAttribute("placeholder", "HP");
// 	pc_life.appendChild(pc_hp);
// 	
// 	pc_life.appendChild(document.createTextNode(" / "));
// 	
// 	pc_max_hp = document.createElement("input");
// 	pc_max_hp.setAttribute("name", "max_hp");
// 	pc_max_hp.setAttribute("class", "hp_field");
// 	pc_max_hp.setAttribute("type", "number");
// 	pc_max_hp.setAttribute("readonly", "true");
// 	pc_max_hp.setAttribute("placeholder", "Max HP");
// 	pc_life.appendChild(pc_max_hp);
// 	
// 	pc_class = document.createElement("input");
// 	pc_class.setAttribute("name", "class");
// 	pc_class.setAttribute("type", "text");
// 	pc_class.setAttribute("readonly", "true");
// 	pc_class.setAttribute("placeholder", "Class");
// 	pc_body.appendChild(pc_class);
// 	
// 	pc_footer = document.createElement("div");
// 	pc_footer.setAttribute("class", "card-footer");
// 	playerCard.append(pc_footer);
// 	
// 	link = document.createElement("a");
// 	link.setAttribute("href", playerLink);
// 	link.setAttribute("class", "card-link");
// 	link.setAttribute("target", "_blank");
// 	link.appendChild(document.createTextNode("Player's Link"));
// 	pc_footer.append(link);
	
	
	test='<div class="card w-25 m-1">\
		<div class="card-body" id="'+playerId+'_card">\
			<form id="'+playerId+'_charashee">\
				<input name="playerId" value="'+playerId+'" style="display:none">\
				<div class="d-flex">\
					<h4 class="card-title character"><input class="w-100" name="character" type="text" readonly="true" placeholder="Character One"></h4>\
					<button type="button" class="close rm-player  align-self-baseline" onclick="removePlayer(\''+playerId+'\')"><i class="fas fa-minus-circle"></i></button>\
				</div>\
				<input class="card-text w-100" name="player" type="text" readonly="true" placeholder="Player">\
				<p class="card-text text-center">\
					<input name="hp" class="hp_field text-right" type="number" readonly="true" placeholder="HP"> / <input name="max_hp" class="hp_field" type="number" readonly="true" placeholder="Max HP">\
				</p>\
				<input name="class" type="text" readonly="true" placeholder="Class">\
			</form>\
		</div>\
		<div class="card-footer">\
			<a href="'+playerLink+'" class="card-link" target="_blank" id="'+playerId+'_link">Player\'s Link</a>\
		</div>\
	</div>';
	$('div#players').append(test);
}

function removePlayerElements(playerId) {
	var player = document.getElementById(playerId+"_card");
	var card=player.parentNode;
	var cardDeck=card.parentNode;
	card.removeChild(player);
	cardDeck.removeChild(card);
}