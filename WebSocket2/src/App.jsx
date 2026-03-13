import { useEffect } from 'react';
import './App.css'
import io from "socket.io-client"


function App() {
  const socket = io("localhost:3000");
  function connectSocket(){
    socket.on("connect", (response)=>{
      console.log("CLIENT: ", response);
    })
  }
  useEffect(()=>{
    connectSocket();
  }, []);
  return (
    <>
      <h1>Multiplayer Dashboard</h1>
    </>
  )
}

export default App
 