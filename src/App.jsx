import { useState,useRef } from 'react'
import './App.css'
import '/src/fonts/PokemonGB.ttf'


function App() {
  const [searchedPokemon, setSearchedPokemon] = useState("");
  const [pokemonNumber, setPokemonNumber] = useState();
  const [pokemonName, setPokemonName] = useState("");
  const [pokemonSprite, setPokemonSprite] = useState("");
  const [pokemonSprite2, setPokemonSprite2] = useState("");
  const [pokemonSprite3, setPokemonSprite3] = useState("");
  const [pokemonType, setPokemonType] = useState("");
  const [pokemonCry, setPokemonCry] = useState(null);
  const [pokemonStats, setPokemonStats] = useState([]);
  const [pokemonMoves, setPokemonMoves] = useState([]);
  const [screenIndex, setScreenIndex] = useState(0);

  const audioRef = useRef(null);
  const clickSoundRef = useRef(new Audio('/button.mp3'));

  async function fetchData(searchedPokemon){
    try{
      clickSoundRef.current.play();

      // Fetch Pokeapi API data
      if(typeof searchedPokemon === 'string') {searchedPokemon = searchedPokemon.toLowerCase() }
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchedPokemon}`);
      if(!response.ok){
        throw new Error('Could not fetch resource.');
      }
      const data = await response.json();

      // Get Name
      setPokemonName(data.name);
      // Get Number
      setPokemonNumber(data.id);
      // Get Front Sprite
      setPokemonSprite(data.sprites.front_default);
      // Get Back Sprite
      setPokemonSprite2(data.sprites.back_default);
       // Get Shiny Sprite
       setPokemonSprite3(data.sprites.front_shiny);
      // Get Type(s)
      setPokemonType(data.types.map(t => t.type.name).join(","));
      // Get Cry
      setPokemonCry(data.cries.latest);
      // Get Stats
      setPokemonStats(data.stats);
      // Get Moves
      setPokemonMoves(data.moves);
  
    }
    catch(error){
      console.error(error);
    }
  }
  
   // Pokemon click sound effect
   const ButtonClick = () => {
    clickSoundRef.current.play();
  };

  // Black button plays pokemon's cry
  const PlayCry = () => {
    if(audioRef.current) { audioRef.current.play(); }
  }

  // Red and Blue buttons toggle between views
  const toggleScreen = (direction) => {
    ButtonClick();
    setScreenIndex((prevIndex) => (prevIndex + direction + 3) % 3);
  };

  // Render what's on the pokedex screen
  const renderScreenContent = () => {
    switch (screenIndex) {
      case 0:
        return (
          <>
              {pokemonName && <p>{pokemonName}</p>}
              {pokemonNumber && <p>No. {pokemonNumber}</p>}
              {pokemonSprite && <img src={pokemonSprite} alt="Pokemon Sprite" />}
              {pokemonType && <p id="type">Type: {pokemonType}</p>}
          </>
        );
      case 1:
        return (
          <>
            {pokemonSprite2 && <img src={pokemonSprite2} alt="Pokemon Sprite" />}
            {pokemonName && <p>Base Stats: </p>}
            {pokemonStats ? (
              pokemonStats.map((stat, index) => (
                <p key={index}>
                  {stat.stat.name}: {stat.base_stat}
                </p>
              ))
            ) : (
              <p>Loading stats...</p>
            )}
          </>
          );
      case 2:
        return (
          <>
            {pokemonName && <p>Shiny Form: </p>}
            {pokemonSprite3 && <img src={pokemonSprite3} alt="Pokemon Sprite" />}
            {pokemonName && <p>Moveset: </p>}

            {pokemonMoves ? (
              pokemonMoves.map((move, index) => (
                <p id='moves' key={index}>
                  {move.move.name}
                </p>
              ))
            ) : (
              <p>Loading moves...</p>
            )}
          </>
          );
      default:
        return null;
    }
  };

  /*window.addEventListener('mousemove', handleMouseMove);
const handleMouseMove = (e) => {
  let tooltip = document.getElementsByClassName("tooltiptext");
  var x = e.clientX,
      y = e.clientY;
  tooltip.style.top = (y + 20) + 'px';
  tooltip.style.left = (x + 20) + 'px';
};*/


  return (
    <>
    {pokemonCry && <audio ref={audioRef} src={pokemonCry} />}
    <div className="main-container">
    <div className="input-container">
      <h1>Pokemon Search</h1>
      <input
        type="text"
        id="searchedPokemon"
        placeholder='Name or No.' 
        value={searchedPokemon}
        onChange={(e) => setSearchedPokemon(e.target.value)}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              fetchData(searchedPokemon);
            }
          }}
        />

      <button id="search" onClick={() => fetchData(searchedPokemon)}>Search Pokemon</button>
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
              {renderScreenContent()}
              
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
            <div className="black-button" onClick={PlayCry}><span className="tooltiptext">Cry</span></div>
            <div className="color-buttons">
              <div className="small-buttons">
                <div className="red-button" onClick={() => toggleScreen(-1)}><span className="tooltiptext">Prev</span></div>
                <div className="blue-button" onClick={() => toggleScreen(1)}><span className="tooltiptext">Next</span></div>
              </div>
              <div className="green-section"></div>
            </div>
            <div className="d-pad">
              <div className='vertical'>
                <div className='up'></div>
                <div className='center'></div>
                <div className='down'></div>
              </div>
              <div className='horizontal'>
                <div className='left' onClick={() => {ButtonClick(); fetchData(pokemonNumber - 1);}}><span className="tooltiptext">Prev Pokemon</span></div>
                <div className='right' onClick={() => {ButtonClick(); fetchData(pokemonNumber + 1);}}><span className="tooltiptext">Next Pokemon</span></div>
              </div>
            </div>
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
