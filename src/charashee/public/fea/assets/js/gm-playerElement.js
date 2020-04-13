function addPlayerElements(playerId, playerLink) {
	card='<div id="'+playerId+'_card">\
		<div class="col s12 m6">\
			<div class="card">\
				<div class="card-content short-cards">\
					<form id="'+playerId+'_character-sheet">\
						<div class="row">\
							<a class="btn-floating btn-small grey right rm-player" onclick="removePlayer(\''+playerId+'\')"><i class="material-icons">remove</i></a>\
							<h4 class="card-title character col s11 input-field">\
								<label for="character">Personnage</label>\
								<input name="character" type="text">\
							</h4>\
						</div>\
						<div class="input-field">\
							<label for="player">Joueur</label>\
							<input name="player" type="text" readonly="true">\
						</div>\
						<div class="row">\
							<div class="input-field col s4 offset-s1">\
								<label for="restauration">Restauration</label>\
								<input name="restauration" type="number" readonly="true" class="center-align">\
							</div>\
							<div class="input-field col s4 offset-s2">\
								<label for="points_fate">Points Fate</label>\
								<input name="points_fate" type="number" readonly="true" class="center-align">\
							</div>\
						</div>\
						<div class="input-field ">\
							<label for="aspect1">Concept</label>\
							<input name="aspect1" type="text" readonly="true">\
						</div>\
						<div class="input-field">\
							<label for="aspect2">Problème</label>\
							<input name="aspect2" type="text" readonly="true">\
						</div>\
					</form>\
				</div>\
				<div class="card-action">\
					<a href="'+playerLink+'" class="card-link" target="_blank" id="'+playerId+'_link">Player\'s Link</a>\
				</div>\
			</div>\
		</div>\
	</div>';
	$('div#playersList').append(card);
// 					<button type="button" class="close rm-player  align-self-baseline" onclick="removePlayer(\''+playerId+'\')"><i class="fas fa-minus-circle"></i></button>\
}

function removePlayerElements(playerId) {
	var player = document.getElementById(playerId+"_card");
	var card=player.parentNode;
	card.removeChild(player);
}