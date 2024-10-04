import { useState } from 'react'
import './App.css'
import '/src/fonts/PokemonGB.ttf'

async function fetchData(){
	try{
    const searchedPokemon = document.getElementById('searchedPokemon').value.toLowerCase();
		const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchedPokemon}`);
    if(!response.ok){
			throw new Error('Could not fetch resource.');
		}
		const data = await response.json();
    // Get Name
    const pokemonName = data.name;
    const nameElement = document.getElementById('pokemonName');
    nameElement.innerText = pokemonName;
    // Get Number
    const pokemonNumber = data.order;
    const numElement = document.getElementById('pokemonNumber');
    numElement.innerText = pokemonNumber;
		// Get Sprite
    const pokemonSprite = data.sprites.front_default;
    const imgElement = document.getElementById('pokemonSprite');
    imgElement.src = pokemonSprite;
    imgElement.style.display = "block";
    // Get Type(s)
    const pokemonType = data.types;
    const typeElement = document.getElementById('pokemonType');
    typeElement.innerText = '';
    let typ = 0;
    for (const i of pokemonType) {
      if(typ>0) typeElement.innerText += ',';
      typeElement.innerText += i.type.name;
      typ++;
    }
    
	}
	catch(error){
		console.error(error);
	}
}

function App() {
  const [count, setCount] = useState(0)


  return (
    <>
    <div className="main-container">
    <div className="input-container">
      <h1>Pokemon Search</h1>
      <input type="text" id="searchedPokemon" placeholder='Enter Pokemon name'></input>
      <button id="search" onClick={fetchData}>Search Pokemon</button>
      </div>
      <div className="dex-container">
        <div className="red-bg">

          <div className="red-top-bar">
            <div className="circle-container">
              <div className="blue-circle"></div>
              <div className="red"></div>
              <div className="yellow"></div>
              <div className="green"></div>
            </div>
          </div>
          <div className="red-top-bar-2"></div>
            
          
          <div className="silver-section">
            
            <div className="top-circle-container">
              <div className="red-circle"></div>
              <div className="red-circle"></div>
            </div>
            <div className="screen">
              <p id="pokemonNumber"></p>
              <p id="pokemonName"></p>
              <br></br>
              <img src="" alt="Pokemon Sprite" id="pokemonSprite" ></img>
              <br></br>
              <p id="pokemonType"></p>
            </div>

            <div className="bottom-circles">
              <div className="big-red-circle"></div>
              <div className="line-container">
                <div className="lines"></div>
                <div className="lines"></div>
                <div className="lines"></div>
              </div>
            </div>
          </div>

          <div className="buttons-container">
            <div className="black-button"></div>
            <div className="color-buttons">
              <div className="small-buttons">
                <div className="red-button"></div>
                <div className="blue-button"></div>
              </div>
              <div className="green-section"></div>
            </div>
            <div className="d-pad"></div>
          </div>

        </div>

        <div className="sidebar-body">
          <div className="sidebar-top"></div>
          <div className="sidebar-bottom"></div>
        </div>
      </div>
      </div>


      <p className="footer">
        Check out my <a href="https://github.com/anadaren">Github</a>
      </p>
    </>
  )
}

export default App
