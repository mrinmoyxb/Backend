import { useEffect, useState, useRef } from 'react';
import './App.css'
import io from "socket.io-client"
import Input from './components/input';


function App() {
  const [score, setScore] = useState({name: "", score: ""});
  const socket = useRef(null);
  const [scores, setAllScores] = useState([])

  useEffect(()=>{
    socket.current = io("http://localhost:3001");
    socket.current.on("connect", ()=>{
      console.log("Client connected: ", socket.current.id);
    });
    socket.current.on("playerScores", (data)=>{
      console.log("scores from server: ", data);
      setAllScores(data);
    })
    
  }, []);

  function handleInput(event){
    let { name, value } = event.target;
    setScore((prev) => ({...prev, [name]: value}));
  }

  function sendScores(){
    console.log("SCORE: ",score);
    socket.current.emit("score", score);
  }

  return (
    <>
      <h1>Multiplayer Dashboard</h1>
      <Input name="name" placeholder="Enter your name" onChange = {handleInput}/>
      <Input name="score" placeholder="Enter your score" onChange = {handleInput}/>
      <button onClick={sendScores} className='send-scores'>Publish Score</button>
      { scores.length > 0 ? <table>
          <tr>
            <th>Name</th>
            <th>Score</th>
          </tr>
         <tbody>
          {scores.map((score) => (
            <tr key={score.id} >
              <td>{score?.name}</td>
              <td>{score?.score}</td>
            </tr>
          ))}
        </tbody>
      </table> : <></>}
    </>
  )
}

export default App
 