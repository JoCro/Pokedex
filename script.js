let currentPokemon;
let statNames = [];
let statvalues = [];
let amountToLoad = 20;
let detailPokemon;
let indexOfSinglePokemonDiv = [];



async function loadThemAll(){

    for (let i = 0; i <= amountToLoad; i++) {
        const element = i +1;
        let url = `https://pokeapi.co/api/v2/pokemon/${element}`
        let response = await fetch(url);
        currentPokemon = await response.json();

        
        indexOfSinglePokemonDiv.push(element);
        document.getElementById('pokemon-gallery').innerHTML += `<div id="${currentPokemon['name']}" onclick="loadPokemon('${element}')" class="single-pokemon ${currentPokemon['types'][0]['type']['name']}"><h2>${currentPokemon['name']}</h2><div class="types-container" id="typesOf${currentPokemon['name']}"></div><img src="${currentPokemon['sprites']['other']['home']['front_shiny']}"></div>`;
        
        for (let j = 0; j < currentPokemon['types'].length; j++) {
            const element = currentPokemon['types'][j]['type']['name'];
            document.getElementById(`typesOf${currentPokemon['name']}`).innerHTML += `<div class="type">${element}</div>`
        }
        
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
    document.getElementById('more-btn').style.display = 'none';
}

function resetFilters(){
    let containers = document.getElementsByClassName('single-pokemon');
     document.getElementById('search-text').value = "";
    
    for(let i = 0; i < containers.length; i++){
        containers[i].style.display = 'flex';
    }
    document.getElementById('more-btn').style.display = 'block';
}

async function loadMorePokemon(){
    index = amountToLoad +1;
    amountToLoad += 20;
    for (let i = index; i <= amountToLoad; i++) {
        const element = i +1;
        let url = `https://pokeapi.co/api/v2/pokemon/${element}`
        let response = await fetch(url);
        currentPokemon = await response.json();

        indexOfSinglePokemonDiv.push(element);
        document.getElementById('pokemon-gallery').innerHTML += `<div id="${currentPokemon['name']}" onclick="loadPokemon('${element}')" class="single-pokemon ${currentPokemon['types'][0]['type']['name']}"><h2>${currentPokemon['name']}</h2><div class="types-container" id="typesOf${currentPokemon['name']}"></div><img src="${currentPokemon['sprites']['other']['home']['front_shiny']}"></div>`;
        for (let j = 0; j < currentPokemon['types'].length; j++) {
            const element = currentPokemon['types'][j]['type']['name'];
            document.getElementById(`typesOf${currentPokemon['name']}`).innerHTML += `<div class="type">${element}</div>`
        }
    }
}


async function loadPokemon(name){

    document.getElementById('detail-view').classList.remove('hidden');

    let url = `https://pokeapi.co/api/v2/pokemon/${name}`;
    let response = await fetch(url);
    detailPokemon = await response.json();
    
        
    

    renderPokemonInfo(name);
}

function renderPokemonInfo(name){


document.getElementById('left-btn').innerHTML = `<button class="ctrl-btn" onclick="checkNextToLoad('minus', ${name})"><p><</p></button>`;
document.getElementById('right-btn').innerHTML = `<button class="ctrl-btn" onclick="checkNextToLoad('plus', ${name})"><p>></p></button>`;
document.getElementById('info-container').innerHTML = ``;
document.getElementById('pokemonName').innerHTML = detailPokemon['name'];
document.getElementById('pokemonPic').src = detailPokemon['sprites']['other']['home']['front_shiny'];
document.getElementById('types').innerHTML = ``;

for(let j = 0; j < detailPokemon['types'].length; j++) {
    
    document.getElementById('types').innerHTML += `<div class="types">${detailPokemon['types'][j]['type']['name']}</div>`;
}


for (let i = 0; i < detailPokemon['stats'].length; i++) {
    let statname = detailPokemon['stats'][i]['stat']['name'];
    let stat = detailPokemon['stats'][i]['base_stat'];
    statNames.push(statname);
    statvalues.push(stat);
}

document.getElementById('info-container').innerHTML += `<div class="canvas-div">
<canvas id="myChart"></canvas>
</div>`

drawChart();
statNames = [];
statvalues = [];
document.getElementById('pokedex').classList = ``;
document.getElementById('pokedex').classList.add(`${detailPokemon['types'][0]['type']['name']}`);
document.body.style.overflowY = 'hidden';

}


function checkNextToLoad(scale, pokemon){

    if(scale == 'minus'){
        if(pokemon > 1){
            pokemon -= 1;
        }else{
            pokemon = indexOfSinglePokemonDiv.length;
        };
        
    }else{
        if(pokemon == indexOfSinglePokemonDiv.length){
            pokemon = 1;
        }else{
            pokemon += 1;
        }
        
    }


    
loadPokemon(pokemon);

}

function closeDetail(){
    document.getElementById('detail-view').classList.add('hidden');
    document.body.style.overflowY = 'unset'
}