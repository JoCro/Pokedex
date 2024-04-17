let currentPokemon;
let statNames = [];
let statvalues = [];
let amountToLoad = 20;
let detailPokemon;
let indexOfSinglePokemonDiv = [];



async function loadThemAll(){ //lädt die ersten 20 Pokemon der API 
    for (let i = 1; i <= amountToLoad; i++) { //für 20x wird folgender code ausgeführt
        const element = i;
        let url = `https://pokeapi.co/api/v2/pokemon/${element}` //die URL wird auf die PokeAPI gesetzt und das Pokemon mit der ID (element == der index) wird geladen
        let response = await fetch(url); //Es wird gewartet, bis das pokemon von der API fertig geladen ist. Dieses wird dann in die Variable response gespeichert.
        currentPokemon = await response.json(); // wenn response(das geladene Pokemon) in ein JSON formatiert wurde, wird dieses JSON in currentPokemon gespeichert.
        displayThePokemon(element);  
    }
}


async function loadMorePokemon(){
    index = amountToLoad +1; //die Variable index wird zu "21", damit das nächste Pokemon, das aus der API geladen wird, das mit der ID 21 ist.
    amountToLoad += 20; //Die Obergrenze für die geladenen Pokemon wird auf 40 erhöht

    for (let i = index; i <= amountToLoad; i++) { //folgendes wird 20 mal wiederholt.
        const element = i;
        let url = `https://pokeapi.co/api/v2/pokemon/${element}`
        let response = await fetch(url);
        currentPokemon = await response.json();
       displayThePokemon(element);
    }
}


function displayThePokemon(element){
    indexOfSinglePokemonDiv.push(element); //Der ehem. indexwert (element) wird in das array gespeichert. element ist ebenfalls die id des Pokemon
    document.getElementById('pokemon-gallery').innerHTML += `<div id="${currentPokemon['name']}" onclick="loadPokemon('${element}')" class="single-pokemon ${currentPokemon['types'][0]['type']['name']}"><h2>${currentPokemon['name']}</h2><div class="types-container" id="typesOf${currentPokemon['name']}"></div><img src="${currentPokemon['sprites']['other']['home']['front_shiny']}"></div>`;
    
    for (let j = 0; j < currentPokemon['types'].length; j++) { //für jeden typ des Pokemon wird folgender Vorgang wiederholt
        const element = currentPokemon['types'][j]['type']['name']; // eine Konstante mit dem Inhalt des Typs wird angelegt
        document.getElementById(`typesOf${currentPokemon['name']}`).innerHTML += `<div class="type">${element}</div>` //dem Pokemon wird der Typ in einem Div übergeben
    }
}


function filterPokemon(){ // Pokemon sollen basierend auf einem Input (text) gefiltert und angezeigt werden. 
    
    let containers = document.getElementsByClassName('single-pokemon'); //eine variable wird angelegt und sie wird mit allen einzelnen pokemon befüllt, die geladen wurden 
    let input = document.getElementById('search-text').value; //Der eingegebene Text des Inputfeldes wird ausgelesen und in der Variable input gespeichert
    for (let i = 0; i < containers.length; i++) { //für jeden Pokemon-Div wird folgendes überprüft
        
        if(!containers[i].id.includes(input)){ //wenn die ID des Pokemon-Divs den text aus dem Inputfield NICHT enthält
            containers[i].style.display = 'none'; //wird der DIV ausgeblendet
        }else{
            containers[i].style.display = 'flex';//ansonsten wird er angezeigt
        }
    }
    displayNone('more-btn'); //nachdem gefiltert wurde, wird der Button, der weitere Pokemon lädt, ausgeblendet
}


function resetFilters(){ //Diese Funktion hebt die Filterung der Pokemon auf
    let containers = document.getElementsByClassName('single-pokemon'); //eine variable wird angelegt und sie wird mit allen einzelnen pokemon befüllt, die geladen wurden 
    document.getElementById('search-text').value = ""; //Der Text der "Suchleiste(Inputfield)" wird geleert
    
    for(let i = 0; i < containers.length; i++){ //für jeden Pokemon-DIV wird folgendes wiederholt
        containers[i].style.display = 'flex';//Jedes geladene Pokemon wird wieder angezeigt
    }
    document.getElementById('more-btn').style.display = 'block'; //Der Button, der noch mehr Pokemon lädt, wird wieder angezeigt.
}


async function loadPokemon(name){ //diese funktion lädt die DetailView des Pokemons, das als Funktionsparameter eingegeben wird. Die ID des Pokemon
    
    document.getElementById('detail-view').classList.remove('hidden'); //Die DetailView wird angezeigt
    let url = `https://pokeapi.co/api/v2/pokemon/${name}`; 
    let response = await fetch(url);
    detailPokemon = await response.json();
    renderPokemonInfo(name); //Die funktion wird mit dem Funktionsparameter name = ID des Pokemon aufgerufen
}


function renderPokemonInfo(name){ //Diese Funktion soll die Stats des Pokemon laden, dessen ID als Funktionsparameter eingegeben wurde 
    getTheElementsForDetailView(name);
    
    for(let j = 0; j < detailPokemon['types'].length; j++) { // Die Typen des Pokemon werden gerendert 
        
        document.getElementById('types').innerHTML += `<div class="types">${detailPokemon['types'][j]['type']['name']}</div>`;
    }

    renderStatsForDetailView(); // Für das aktuelle Pokemon wird hiermit die Stats geladen
    gimmeTheChart();
}


function getTheElementsForDetailView(name){
    document.getElementById('left-btn').innerHTML = `<button class="ctrl-btn" onclick="checkNextToLoad('minus', ${name})"><p><</p></button>`;
    document.getElementById('right-btn').innerHTML = `<button class="ctrl-btn" onclick="checkNextToLoad('plus', ${name})"><p>></p></button>`;
    document.getElementById('info-container').innerHTML = ``;
    document.getElementById('pokemonName').innerHTML = detailPokemon['name'];
    document.getElementById('pokemonPic').src = detailPokemon['sprites']['other']['home']['front_shiny'];
    document.getElementById('types').innerHTML = ``;
}


function gimmeTheChart(){
    document.getElementById('info-container').innerHTML += `<div class="canvas-div"><canvas id="myChart"></canvas></div>`
    drawChart();
    statNames = [];
    statvalues = [];
    document.getElementById('pokedex').classList = ``;
    document.getElementById('pokedex').classList.add(`${detailPokemon['types'][0]['type']['name']}`); //Dem Pokemon wird die Klasse anhand seines 1. Typs zugewiesen.
    document.body.style.overflowY = 'hidden'; //Das Scrollen wird verhindert
}


function renderStatsForDetailView(){
    for (let i = 0; i < detailPokemon['stats'].length; i++) { // für jeden Stat des Pokemon wird folgendes ausgeführt
        let statname = detailPokemon['stats'][i]['stat']['name']; //die Variable statname bekommt den Namen des Stats als Wert
        let stat = detailPokemon['stats'][i]['base_stat']; //Die variable Stat bekommt den Wert des jeweiligen Stats als Wert
        statNames.push(statname); //
        statvalues.push(stat);
    }
}


function checkNextToLoad(scale, pokemon) {
    let totalPokemon = indexOfSinglePokemonDiv.length;
    
    if (scale === 'minus') {
        pokemon = (pokemon > 1) ? pokemon - 1 : totalPokemon;
    } else {
        pokemon = (pokemon < totalPokemon) ? pokemon + 1 : 1;
    }
    loadPokemon(pokemon);
}



function closeDetail(){ //diese funktion, soll die DetailView schließen
    document.getElementById('detail-view').classList.add('hidden'); //Der DetailView wird die Klasse hidden übergeben = display:none
    document.body.style.overflowY = 'unset' //Es kann wieder gescrollt werden.
}


function displayNone(object){
    document.getElementById(object).style.display = 'none';
}