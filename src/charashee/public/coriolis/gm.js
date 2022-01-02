function addPlayerElements(playerId, playerLink) {
	card='<div class="col" id="'+playerId+'_card">\
		<div class="card h-100">\
			<form id="'+playerId+'_coriolis">\
				<div class="card-header position-relative">\
					<div class="row">\
						<div class="col">\
							<div class="form-floating">\
								<input type="text" id="player" name="player" class="form-control" placeholder="Joueur" readonly>\
								<label for="player">Joueur :</label>\
							</div>\
						</div>\
						<div class="col">\
							<div class="form-floating">\
								<input type="text" id="character" name="character" class="form-control" placeholder="Personnage" readonly>\
								<label for="character">Personnage :</label>\
							</div>\
						</div>\
					</div>\
					<button type="button" class="btn btn-link position-absolute top-0 start-100 translate-middle rounded-circle" onclick="removePlayer(\''+playerId+'\')">\
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#dc3545" class="bi bi-x-circle-fill" viewBox="0 0 16 16">\
							<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"></path>\
						</svg>\
					</svg></button>\
				</div>\
				<div class="row card-body">\
					<div class="col">\
						<div class="row label-border">\
							<div class="col-2 col-lg-2 col-sm-4 col-xl-4 col-md-4 col-xxl-5">\
								<label for="hp">PV</label>\
							</div>\
							<div class="col input-group">\
								<input type="text" id="hp" name="hp" class="form-control" readonly>\
								<input type="text" id="hp_disp" name="hp_disp" class="form-control" readonly>\
							</div>\
						</div>\
					</div>\
					<div class="col">\
						<div class="row label-border">\
							<div class="col-2 col-lg-2 col-sm-4 col-xl-4 col-md-4 col-xxl-5">\
								<label for="mp">MP</label>\
							</div>\
							<div class="col input-group">\
								<input type="text" id="mp" name="mp" class="form-control" readonly>\
								<input type="text" id="mp_disp" name="mp_disp" class="form-control input-group-text" readonly>\
							</div>\
						</div>\
					</div>\
					<div class="col">\
						<div class="row label-border">\
							<div class="col-2 col-lg-2 col-sm-4 col-xl-4 col-md-4 col-xxl-5">\
								<label for="reputation" class="d-none d-xl-block">Réput.</label>\
								<label for="reputation" class="d-block d-xl-none">Rép</label>\
							</div>\
							<div class="col">\
								<input type="text" id="reputation" name="reputation" class="form-control" readonly>\
							</div>\
						</div>\
					</div>\
				</div>\
				<div>\
					<div class="row card-body">\
						<div class="col">\
							<div class="row label-border">\
								<div class="col-4 col-xl-6 px-0 mx-0">\
									<label for="agility" class="d-none d-xl-block">Agilité</label>\
									<label for="agility" class="d-block d-xl-none">Agi</label>\
								</div>\
								<div class="col ps-0 pe-1 ms-0">\
									<input type="text" id="agility" name="agility" class="form-control" readonly>\
								</div>\
							</div>\
						</div>\
						<div class="col">\
							<div class="row label-border">\
								<div class="col-4 col-xl-6 px-0 mx-0">\
									<label for="wits" class="d-none d-xl-block">Astuce</label>\
									<label for="wits" class="d-block d-xl-none">Ast</label>\
								</div>\
								<div class="col ps-0 pe-1 ms-0">\
									<input type="text" id="wits" name="wits" class="form-control" readonly>\
								</div>\
							</div>\
						</div>\
						<div class="col">\
							<div class="row label-border">\
								<div class="col-4 col-xl-6 px-0 mx-0">\
									<label for="empathy" class="d-none d-xl-block">Empathie</label>\
									<label for="empathy" class="d-block d-xl-none">Em</label>\
								</div>\
								<div class="col ps-0 pe-1 ms-0">\
									<input type="text" id="empathy" name="empathy" class="form-control" readonly>\
								</div>\
							</div>\
						</div>\
						<div class="col">\
							<div class="row label-border">\
								<div class="col-4 col-xl-6 px-0 mx-0">\
									<label for="strength" class="d-none d-xl-block">Vigueur</label>\
									<label for="strength" class="d-block d-xl-none">Vig</label>\
								</div>\
								<div class="col ps-0 pe-1 ms-0">\
									<input type="text" id="strength" name="strength" class="form-control" readonly>\
								</div>\
							</div>\
						</div>\
						<div class="col-1 px-0 mx-0">\
							<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample"></button>\
						</div>\
					</div>\
					<div class="collapse" id="collapseExample">\
						<div class="card card-body">\
							<div class="d-flex flex-wrap">\
								<div class="form-floating">\
									<input type="text" id="dexterity_disp" name="dexterity_disp" class="form-control" readonly>\
									<label for="dexterity">Dex</label>\
								</div>\
								<div class="form-floating">\
									<input type="text" id="force_disp" name="force_disp" class="form-control" readonly>\
									<label for="force">For</label>\
								</div>\
								<div class="form-floating">\
									<input type="text" id="infiltration_disp" name="infiltration_disp" class="form-control" readonly>\
									<label for="infiltration">Inf</label>\
								</div>\
								<div class="form-floating">\
									<input type="text" id="_disp" name="manipulation_disp" class="form-control" readonly>\
									<label for="manipulation">Man</label>\
								</div>\
								<div class="form-floating">\
									<input type="text" id="melee_disp" name="melee_disp" class="form-control" readonly>\
									<label for="melee">Mél</label>\
								</div>\
								<div class="form-floating">\
									<input type="text" id="observation_disp" name="observation_disp" class="form-control" readonly>\
									<label for="observation">Obs</label>\
								</div>\
								<div class="form-floating">\
									<input type="text" id="survival_disp" name="survival_disp" class="form-control" readonly>\
									<label for="survival">Sur</label>\
								</div>\
								<div class="form-floating">\
									<input type="text" id="ranged_disp" name="ranged_disp" class="form-control" readonly>\
									<label for="ranged">Ran</label>\
								</div>\
								<div class="form-floating">\
									<input type="text" id="command_disp" name="command_disp" class="form-control" readonly>\
									<label for="command">Com</label>\
								</div>\
								<div class="form-floating">\
									<input type="text" id="culture_disp" name="culture_disp" class="form-control" readonly>\
									<label for="culture">Cul</label>\
								</div>\
								<div class="form-floating">\
									<input type="text" id="data_djinn_disp" name="data_djinn_disp" class="form-control" readonly>\
									<label for="data_djinn">Dat</label>\
								</div>\
								<div class="form-floating">\
									<input type="text" id="medicurgy_disp" name="medicurgy_disp" class="form-control" readonly>\
									<label for="medicurgy">Méd</label>\
								</div>\
								<div class="form-floating">\
									<input type="text" id="pilot_disp" name="pilot_disp" class="form-control" readonly>\
									<label for="pilot">Pil</label>\
								</div>\
								<div class="form-floating">\
									<input type="text" id="mystic_disp" name="mystic_disp" class="form-control" readonly>\
									<label for="mystic">Pou</label>\
								</div>\
								<div class="form-floating">\
									<input type="text" id="science_disp" name="science_disp" class="form-control" readonly>\
									<label for="science">Sci</label>\
								</div>\
								<div class="form-floating">\
									<input type="text" id="technology_disp" name="technology_disp" class="form-control" readonly>\
									<label for="technology">Tec</label>\
								</div>\
							</div>\
						</div>\
					</div>\
				</div>\
				<div class="card-footer">\
					<a href="'+playerLink+'" class="card-link" target="_blank" id="'+playerId+'_link">Lien Joueur</a>\
				</div>\
			</form>\
		</div>\
	</div>';
	
	$('div#playersList').append(card);
}


function removePlayerElements(playerId) {
	var player = document.getElementById(playerId+"_card");
	var card=player.parentNode;
	card.removeChild(player);
}
