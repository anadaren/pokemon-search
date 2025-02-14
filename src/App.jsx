import { useEffect,useState,useRef } from 'react'
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

  

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [tooltipCryVisible, setTooltipCryVisible] = useState(false);
  const [tooltipPrevVisible, setTooltipPrevVisible] = useState(false);
  const [tooltipNextVisible, setTooltipNextVisible] = useState(false);
  const [tooltipLeftVisible, setTooltipLeftVisible] = useState(false);
  const [tooltipRightVisible, setTooltipRightVisible] = useState(false);
  

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
            {pokemonName && <p>Back: </p>}
            {pokemonSprite2 && <img src={pokemonSprite2} alt="Pokemon Sprite" />}
            {pokemonName && <p>Base Stats: </p>}
            {pokemonStats ? (
              pokemonStats.map((stat, index) => (
                <p id='stats' key={index}>
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

  // Tooltips
  useEffect(() => {
    const handlePointerMove = (event) => {
      const { clientX, clientY } = event;
      setPosition({ x: clientX, y: clientY });
    };

    const handleMouseEnter = (tooltipType) => {
      switch (tooltipType) {
        case 'cry': setTooltipCryVisible(true); break;
        case 'next': setTooltipNextVisible(true); break;
        case 'prev': setTooltipPrevVisible(true); break;
        case 'left': setTooltipLeftVisible(true); break;
        case 'right': setTooltipRightVisible(true); break;
      }
    };
    
    const handleMouseLeave = (tooltipType) => {
      switch (tooltipType) {
        case 'cry': setTooltipCryVisible(false); break;
        case 'next': setTooltipNextVisible(false); break;
        case 'prev': setTooltipPrevVisible(false); break;
        case 'left': setTooltipLeftVisible(false); break;
        case 'right': setTooltipRightVisible(false); break;
      }
    };

    document.body.addEventListener("pointermove", handlePointerMove);
    const cryHover = document.getElementById("black-button");
    const prevHover = document.getElementById("red-button");
    const nextHover = document.getElementById("blue-button");
    const leftHover = document.getElementById("left");
    const rightHover = document.getElementById("right");

    if (cryHover) {
      cryHover.addEventListener("mouseenter", () => handleMouseEnter("cry"));
      cryHover.addEventListener("mouseleave", () => handleMouseLeave("cry"));
    }
    if (prevHover) {
      prevHover.addEventListener("mouseenter", () => handleMouseEnter("prev"));
      prevHover.addEventListener("mouseleave", () => handleMouseLeave("prev"));
    }
    if (nextHover) {
      nextHover.addEventListener("mouseenter", () => handleMouseEnter("next"));
      nextHover.addEventListener("mouseleave", () => handleMouseLeave("next"));
    }
    if (leftHover) {
      leftHover.addEventListener("mouseenter", () => handleMouseEnter("left"));
      leftHover.addEventListener("mouseleave", () => handleMouseLeave("left"));
    }
    if (rightHover) {
      rightHover.addEventListener("mouseenter", () => handleMouseEnter("right"));
      rightHover.addEventListener("mouseleave", () => handleMouseLeave("right"));
    }
    

    return () => {
      document.body.removeEventListener("pointermove", handlePointerMove);
      if (cryHover) {
        cryHover.removeEventListener("mouseenter", () => handleMouseEnter("cry"));
        cryHover.removeEventListener("mouseleave", () => handleMouseLeave("cry"));
      }
      if (prevHover) {
        prevHover.removeEventListener("mouseenter", () => handleMouseEnter("prev"));
        prevHover.removeEventListener("mouseleave", () => handleMouseLeave("prev"));
      }
      if (nextHover) {
        nextHover.removeEventListener("mouseenter", () => handleMouseEnter("next"));
        nextHover.removeEventListener("mouseleave", () => handleMouseLeave("next"));
      }
      if (leftHover) {
        leftHover.removeEventListener("mouseenter", () => handleMouseEnter("left"));
        leftHover.removeEventListener("mouseleave", () => handleMouseLeave("left"));
      }
      if (rightHover) {
        rightHover.removeEventListener("mouseenter", () => handleMouseEnter("right"));
        rightHover.removeEventListener("mouseleave", () => handleMouseLeave("right"));
      }
    };    
  }, []);


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

            <div id="black-button" className="black-button" onClick={PlayCry}>
              {tooltipCryVisible && (
                <div
                  style={{
                    position: "fixed",
                    left: position.x + 40,
                    top: position.y + 20,
                    width: "5em",
                    height: "1.75em",
                    backgroundColor: "#343434",
                    border: "2px solid black",
                    borderRadius: "6px",
                    pointerEvents: "none",
                    transform: "translate(-50%, -50%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontsize: ".75em",
                    zIndex: "99",
                  }}>Cry</div>
                )}
            </div>

            <div className="color-buttons">
              <div className="small-buttons">
                
                <div id="red-button" className="red-button" onClick={() => pokemonName && toggleScreen(-1)}>
                {tooltipPrevVisible && (
                <div
                  style={{
                    position: "fixed",
                    left: position.x + 50,
                    top: position.y + 20,
                    width: "6em",
                    height: "1.75em",
                    backgroundColor: "#343434",
                    border: "2px solid black",
                    borderRadius: "6px",
                    pointerEvents: "none",
                    transform: "translate(-50%, -50%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontsize: ".75em",
                    zIndex: "99",
                  }}>Prev</div>
                )}
                </div>
                
                <div id="blue-button" className="blue-button" onClick={() => pokemonName && toggleScreen(1)}>
                {tooltipNextVisible && (
                <div
                  style={{
                    position: "fixed",
                    left: position.x + 50,
                    top: position.y + 20,
                    width: "6em",
                    height: "1.75em",
                    backgroundColor: "#343434",
                    border: "2px solid black",
                    borderRadius: "6px",
                    pointerEvents: "none",
                    transform: "translate(-50%, -50%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontsize: ".75em",
                    zIndex: "99",
                  }}>Next</div>
                )}
                </div>

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
                <div id="left" className='left' onClick={() => {ButtonClick(); fetchData(pokemonNumber - 1);}}>
                {tooltipLeftVisible && (
                <div
                  style={{
                    position: "fixed",
                    left: position.x + 80,
                    top: position.y + 20,
                    width: "10em",
                    height: "1.75em",
                    backgroundColor: "#343434",
                    border: "2px solid black",
                    borderRadius: "6px",
                    pointerEvents: "none",
                    transform: "translate(-50%, -50%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontsize: ".75em",
                    zIndex: "99",
                    padding: "5px 0",
                  }}>Prev Pokemon</div>
                )}
                </div>
                <div id="right" className='right' onClick={() => {ButtonClick(); fetchData(pokemonNumber + 1);}}>
                {tooltipRightVisible && (
                <div
                  style={{
                    position: "fixed",
                    left: position.x + 80,
                    top: position.y + 20,
                    width: "10em",
                    height: "1.75em",
                    backgroundColor: "#343434",
                    border: "2px solid black",
                    borderRadius: "6px",
                    pointerEvents: "none",
                    transform: "translate(-50%, -50%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontsize: ".75em",
                    zIndex: "99",
                    padding: "5px 0",
                  }}>Next Pokemon</div>
                )}
                </div>
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
