let currentPokemon;
let statNames = [];
let statvalues = [];
let amountToLoad = 20;
let detailPokemon;
let indexOfSinglePokemonDiv = [];



async function loadThemAll(){ 
    for (let i = 1; i <= amountToLoad; i++) { 
        const element = i;
        let url = `https://pokeapi.co/api/v2/pokemon/${element}` 
        let response = await fetch(url); 
        currentPokemon = await response.json(); 
        displayThePokemon(element);  
    }
}


async function loadMorePokemon(){
    displayNone('more-btn');
    index = amountToLoad +1; 
    amountToLoad += 20; 
    
    
    
    for (let i = index; i <= amountToLoad; i++) { 
        const element = i;
        let url = `https://pokeapi.co/api/v2/pokemon/${element}`
        let response = await fetch(url);
        currentPokemon = await response.json();
        displayThePokemon(element);
    }
    document.getElementById('more-btn').style.display = 'block';
}


function displayThePokemon(element){
    indexOfSinglePokemonDiv.push(element); 
    document.getElementById('pokemon-gallery').innerHTML += `<div id="${currentPokemon['name']}" onclick="loadPokemon('${element}')" class="single-pokemon ${currentPokemon['types'][0]['type']['name']}"><h2>${currentPokemon['name']}</h2><div class="types-container" id="typesOf${currentPokemon['name']}"></div><img src="${currentPokemon['sprites']['other']['home']['front_shiny']}"></div>`;
    
    for (let j = 0; j < currentPokemon['types'].length; j++) { 
        const element = currentPokemon['types'][j]['type']['name'];
        document.getElementById(`typesOf${currentPokemon['name']}`).innerHTML += `<div class="type">${element}</div>` 
    }
}


function filterPokemon(){ 
    
    let containers = document.getElementsByClassName('single-pokemon');  
    let input = document.getElementById('search-text').value; 
    for (let i = 0; i < containers.length; i++) { 
        
        if(!containers[i].id.includes(input)){ 
            containers[i].style.display = 'none'; 
        }else{
            containers[i].style.display = 'flex';
        }
    }
    displayNone('more-btn'); 
}


function resetFilters(){ 
    let containers = document.getElementsByClassName('single-pokemon');  
    document.getElementById('search-text').value = ""; 
    
    for(let i = 0; i < containers.length; i++){ 
        containers[i].style.display = 'flex';
    }
    document.getElementById('more-btn').style.display = 'block'; 
}


async function loadPokemon(name){ 
    
    document.getElementById('detail-view').classList.remove('hidden'); 
    let url = `https://pokeapi.co/api/v2/pokemon/${name}`; 
    let response = await fetch(url);
    detailPokemon = await response.json();
    renderPokemonInfo(name); 
}


function renderPokemonInfo(name){  
    getTheElementsForDetailView(name);
    
    for(let j = 0; j < detailPokemon['types'].length; j++) { 
        
        document.getElementById('types').innerHTML += `<div class="types">${detailPokemon['types'][j]['type']['name']}</div>`;
    }
    
    renderStatsForDetailView();
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
    document.getElementById('pokedex').classList.add(`${detailPokemon['types'][0]['type']['name']}`);
    document.body.style.overflowY = 'hidden';
}


function renderStatsForDetailView(){
    for (let i = 0; i < detailPokemon['stats'].length; i++) { 
        let statname = detailPokemon['stats'][i]['stat']['name']; 
        let stat = detailPokemon['stats'][i]['base_stat']; 
        statNames.push(statname); 
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


function closeDetail(){ 
    document.getElementById('detail-view').classList.add('hidden'); 
    document.body.style.overflowY = 'unset' 
}


function displayNone(object){
    document.getElementById(object).style.display = 'none';
}