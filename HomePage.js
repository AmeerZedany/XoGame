import React, { useEffect, useRef ,useState } from "react";
import './HomePage.css';
import XOimage from './XOimage.jpg'; // Assuming the image is in the same directory as this component file
import Face from './Face.png'; // Assuming the image is in the same directory as this component file
import { useNavigate} from 'react-router-dom';
function HomeComp({setgameOn , mode , setMode ,setPlayer1 ,setPlayer2 }) {
    
    const [selectedOption, setSelectedOption] = useState("");
    const multiplayerButtonRef = useRef(null);
    const OnePlayerButtonRef = useRef(null);
    const two_players = useRef(null);
    const one_player = useRef(null);
    const difficultyRef = useRef(null);
    const Player1Text = useRef(null);
    const Player2Text = useRef(null);
    const Player3Text = useRef(null);
    const navigate = useNavigate();

    useEffect( () => {
        setMode(0);
    },[]);

    const handleReadMoreClick = () => {
        window.open('https://www.wikihow.com/Play-Tic-Tac-Toe'); // Replace 'https://example.com' with your desired URL
      };

    const handleMultiplayer = () => {

        multiplayerButtonRef.current.style.backgroundColor = "#444444";
        multiplayerButtonRef.current.style.color = "white";
        multiplayerButtonRef.current.style.borderColor = "#007bff";

        OnePlayerButtonRef.current.style.backgroundColor = "white";
        OnePlayerButtonRef.current.style.color = "black";
        OnePlayerButtonRef.current.style.borderColor = "#ccc";

        two_players.current.style.display = "contents";
        one_player.current.style.display = "none";

        difficultyRef.current.style.display = "none";
        setSelectedOption(null);

        setMode(0);
        
    };

    const handleOnePlayer = () => {
        OnePlayerButtonRef.current.style.backgroundColor = "#444444";
        OnePlayerButtonRef.current.style.color = "white";
        OnePlayerButtonRef.current.style.borderColor = "#007bff";

        multiplayerButtonRef.current.style.backgroundColor = "white";
        multiplayerButtonRef.current.style.color = "black";
        multiplayerButtonRef.current.style.borderColor = "#ccc";

        two_players.current.style.display = "none"
        one_player.current.style.display = "contents"
        difficultyRef.current.style.display = difficultyRef.current.tagName === "SPAN" ? "inline" : "block";
        if (mode === 0 ){
            setMode(3);
        }
        };

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
        if (event.target.value === 'Easy'){
            setMode(1);
        }
        else if (event.target.value === 'Hard'){
            setMode(2);
        }
      };

    const handlePlayClick = () =>{
        // mode (if mode == 1 One player , mode== 0 2 player)
        console.log("Game start");
        
        if (mode === 0) {
            console.log("Mode two Player");
            console.log("Player1 : ",Player1Text.current.value);
            console.log("Player2 : ",Player2Text.current.value);
            if(Player1Text.current.value === ''){
                setPlayer1("Player 1");
            }
            else{
                setPlayer1(Player1Text.current.value);
            }
            if(Player2Text.current.value === ''){
                setPlayer2("Player 2");
            }
            else{
                setPlayer2(Player2Text.current.value);
            }
            setgameOn(1);
            navigate("/Game");
        }
        else{
            console.log("Mode : " , mode);
            if(mode !== 1 && mode !== 2){
                window.alert("Please Selecte Level"); 
            }
            else{
                if(Player3Text.current.value === ''){
                    setPlayer1("Player");
                }
                else{
                    setPlayer1(Player3Text.current.value);
                }
                setgameOn(1);
                navigate("/Game");
            }
            
        }
    }

    return(
        <div>
            <div className="TopLeft">
                <h5>@ XO</h5>
            </div>
            <div>
                <img className="image1" src={XOimage} alt="XO1" />
            </div>
            <div className="Class1">
                <h1>Developed by AsalTech</h1>
                <p>You can play XO game in two modes<br/>
                please select the mode to Start the Game</p>
                <p>Select mode:</p>
            </div>
            <div className="modes">
                <button  ref={multiplayerButtonRef} className="changeMode" id="Multiplayer" onClick={handleMultiplayer}>Multiplayer</button>
                <button  ref={OnePlayerButtonRef} className="changeMode" id="OnePlayer" onClick={handleOnePlayer}>One Player</button>
            </div>

            <div className="two_players" ref={two_players}>
                <input ref={Player1Text} className="txt" type="text" placeholder="Player1" id="Player1Text"/>
                <img className = "image3" src={Face} alt="Face2"/>
                <input ref={Player2Text} className="txt" type="text" placeholder="Player2" id="Player2Text"/>
                <img className = "image2" src={Face} alt="Face1"/>
            </div>

            <div className="one_player" ref={one_player}>
                <input ref={Player3Text} className="txt" type="text" placeholder="Player" id="PlayerText1"/>
                <img className = "image4" src={Face} alt="Face2"/>
            </div>

            <div ref={difficultyRef} className="difficulty">
                <label className={selectedOption === "Easy" ? "radio-button selected" : "radio-button"}>
                    <input
                    type="radio"
                    value="Easy"
                    checked={selectedOption === "Easy"}
                    onChange={handleOptionChange}
                    className ="point"
                    />
                    <span className="radio-text">Easy</span>
                </label>
                <label className={selectedOption === "Hard" ? "radio-button selected" : "radio-button"}>
                    <input
                    type="radio"
                    value="Hard"
                    checked={selectedOption === "Hard"}
                    onChange={handleOptionChange}
                    className ="point"
                    />
                    <span className="radio-text">Hard</span>
                </label>
            </div>
            <div className="Class3">
                <button  className="CLick" id="PlayClick"onClick={handlePlayClick}> Play</button>
                <button  className="CLick" id="ReadMore" onClick={handleReadMoreClick}>Read More</button>
            </div>
            
        </div>
    );
}

export default HomeComp;