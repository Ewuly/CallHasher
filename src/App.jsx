import React, { useState } from 'react';
import { abi, contractAddress } from "./constants.js";
import { ethers } from 'ethers';
import { Web3 } from 'web3';
import './App.css';

function App() {
  const [move, setMove] = useState(0);
  const [salt, setSalt] = useState(0);
  const [hashResult, setHashResult] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('Disconnected'); // Added state for button text
  const provider = new ethers.providers.Web3Provider(window.ethereum);


  const handleMoveChange = (event) => {
    setMove(event.target.value);
  };

  const handleSaltChange = (event) => {
    setSalt(event.target.value);
  };
  async function getHash() {
    try {
        if (typeof window.ethereum !== "undefined") {
          // console.log('MetaMask is installed!');
            // Check if MetaMask is connected
            const web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.getAccounts();
            if (accounts.length > 0) {
              // console.log('MetaMask is connected!');
                setConnectionStatus('Connected');
                const contract = new web3.eth.Contract(abi, contractAddress);

                // Retrieve the name
                const hash = await contract.methods.hash(move,salt).call();
                setHashResult(hash);
                console.log(hash);
            }
            else {
                // setConnectionStatus('Please connect MetaMask');
                try {
                  await ethereum.request({ method: "eth_requestAccounts" })
                  setConnectionStatus('Connected'); // Update button text
                  const accounts = await ethereum.request({ method: "eth_accounts" })
                  console.log(accounts)
                } catch (error) {
                  console.log(error)
                }
            }
        }
    } catch (error) {
        console.error(error);
    }
}



  async function connect() {
    if (typeof window.ethereum !== "undefined") {
      try {
        await ethereum.request({ method: "eth_requestAccounts" })
        setConnectionStatus('Connected'); // Update button text
        const accounts = await ethereum.request({ method: "eth_accounts" })
        console.log(accounts)
      } catch (error) {
        console.log(error)
      }
    } else {
      setConnectionStatus('Please install MetaMask'); // Update button text
    }
  }

  return (
    <>
      <div>
        {/* <button onClick={connect}>Connect</button> */}
      </div>
      <input type="text" value={move} onChange={handleMoveChange} placeholder="Enter move" />
      <input type="text" value={salt} onChange={handleSaltChange} placeholder="Enter salt" />
      <button onClick={getHash}>Test</button>
      <div>
        <strong>Hash Result:</strong> {hashResult}
      </div>
    </>
  );
}

export default App;
