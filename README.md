Instructions to build a new character sheet
-------------------------------------------

The page (simplified) structure should be somthing like:

```html
<html>
  <head>...</head>
  <body>
    <form nclass="toSave"  id="charashee" style="display:none;">
      <input name="playerId" id="playerId" type="text" readonly>
      <input name="game" id="game" type="text" value="Game Name">
    </form>
    
    <form class="toSave" id="whatever">
      ... Character sheet in the form of inputs (with a "name" property) ...
      <input name="player" ...>
      <input name="character" ...>
    </form>
    
    <button id='joinTable' class='btn'>Join a table</button>
    <button id='export' class='btn'>Export</button>
    <span>
      <label for='import' class='btn'>Import</label>
      <input id='import' name='import' style='visibility:hidden;' type='file' accept='application/json,.json'>
    </span>

    <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
    <script src="../libs/paho-mqtt.js" type="text/javascript"></script>
    <script src="../libs/populate.js" type="text/javascript"></script>
    <script src="../libs/lzstring.js" type="text/javascript"></script>
    <script src="../libs/sheet-mem.js" type="text/javascript"></script>
    <script src="../libs/pl.js" type="text/javascript"></script>
  </body>
</html>
```

The first form, although hidden is mandatory for Charashee to work properlly.

You can have as many saved forms as you want, simply give them a **unique id** and use the **`toSave` class**. Hence if you want a form to not be saved (the data are lost when the page is reloaded), simply do not use the class.

In a form all the input **with a `name`** are saved. If you want an input to have a `name` and prevent it to be saved add the class `noSave` to the input field.
Two fields are expected in the character sheet ('whatever' in the exemple): a `player` input and a `character` input.

All the informations you want to save (even static fields) must be inputs. You can use `readonly` and particular styling to make them appear as text.
The supported inputs types are: `<input>` of type `text`, `number`, `checkbox`, `radio`, `date`, `<select>` (not multiple) and `<textarea>`. (Support for other inputs type to come soon.)

Anywhere in the document you should palce the three buttons 'Join a table, Export, Import' (they are detected through their Id).
Finally integrate all the necessary scripts.

The structure of the page can be as complex as you need, as long as the inputs you want to save have a name and are inside a form with an id and the `toSave` class.





Instructions to build a new Game-Master page
--------------------------------------------

The page (simplified) structure should be somthing like:

```html
<html>
  <head>...</head>
  <body>
    <form nclass="toSave"  id="gm-info">
      <input name="tid" id="tid" type="text" readonly">
      <input name="game" id="game" type="text" value="Game Name" style="display:none;">
      <input name="master" id="master" type="text">
    </form>
    
    <ul style="display:none">
    <form id="players" class="toSave">
    </form>
    </ul>
    
    <p>Players: <p>
    <div><button id='addPlayer' class='btn'>Add a Player</button></div>
    <div id="playersList">
    </div>

    <button id='export' class='btn'>Export</button>
    <span>
      <label for='import' class='btn'>Import</label>
      <input id='import' name='import' style='visibility:hidden;' type='file' accept='application/json,.json'>
    </span>

    <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
    <script src="../libs/paho-mqtt.js" type="text/javascript"></script>
    <script src="../libs/sheet-mem.js" type="text/javascript"></script>
    <script src="../libs/lzstring.js" type="text/javascript"></script>
    <script src="../libs/populate.js" type="text/javascript"></script>
    <script src="../libs/gm.js" type="text/javascript"></script>
    <script src="gm-playerElement.js" type="text/javascript"></script>
  </body>
</html>
```

The first form, called **`gm-info`** should store the `tid` and the `game`. It is recommended to display the TID since it is the number given to player that use their "Join a Table" button.

Then you must create a `ul` that will be hidden and will store all the data on the palyers.

You can then add a "Add a Player" wherever you want with id `addPlayer`.

You must then place a `playerList` element which should recieve the display elements for each player (cards for intance). See below for the display definition.

Finally you can add the 'Export, Import' button (same as the palyer, they are detected by thier Id).

The GM page is not sufficient, you must define two functions that handle the creation of the element used to display the players details. The idea is that you can choose how much content from each player's sheet you want to display.

In the example above, those functions are defined in the "gm-playerElement.js" script, but you can place them where you want. only their prototype is important.

They must be defined as follow:

```javascript
function addPlayerElements(playerId, playerLink) {
  ...
}

function removePlayerElements(playerId) {
	...
}
```

They should create the following elements:
 - A form for each form in the players' sheet. The id must be `playerId+"_nameOfTheForm"`.
 - An input for each field with the same name.
 - A button to remove the element (calling `removePlayer(\''+playerId+'\')`).
 - A player link, with this definition: `<a href="'+playerLink+'" class="card-link" target="_blank" id="'+playerId+'_link">Player\'s Link</a>`
 - The remove function should completely remove the element from the `playerList` div.





Appendix
========
 
Integrate 'charashee' in a complex framework
--------------------------------------------

 Some web framework requires more interactivity to offer a nice display. For instance, they trigger transitions on some events. In order to allow such behaviour, charashee embbeds the following functions.
 
If you define :
```javascript
function refreshPageDisplay(){
	...
}
```

It is called every time the page content is updated and this allows you to run the code you want to trigger transitions.