import React, { useState } from 'react';
import { HasherAbi, HasherAddress } from "./HasherContract.js";
import { RPSAbi, RPSAddress } from "./RPSContract.js";
import { ethers } from 'ethers';
import { Web3 } from 'web3';
import './App.css';
import { checkProperties } from 'ethers/lib/utils.js';

function App() {
  const [move, setMove] = useState(0);
  const [salt, setSalt] = useState(0);
  const [address, setAddress] = useState('0x'); // Added state for button text
  const [hashResult, setHashResult] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('Disconnected'); // Added state for button text
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const [network, setNetwork] = useState(null);

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handleMoveChange = (event) => {
    setMove(event.target.value);
  };

  const handleSaltChange = (event) => {
    setSalt(event.target.value);
  };

  async function getHash() {
    try {
      console.log("1");
      const networkData = await provider.getNetwork();
      console.log("a");
      try {
        if (typeof window.ethereum !== "undefined") {
          console.log('MetaMask is installed!');
          // Check if MetaMask is connected
          const web3 = new Web3(window.ethereum);
          const accounts = await web3.eth.getAccounts();
          if (accounts.length > 0) {
            console.log('MetaMask is connected!');
            setConnectionStatus('Connected');

            if (networkData.chainId !== 11155111) {

              console.log('This is not Sepolia network.');

              // Provide a user-friendly message
              // const switchNetworkMessage = `Please switch to the Sepolia network (ID: 11155111) in your MetaMask.`;
              // alert(switchNetworkMessage);

              // Prompt the user to switch networks
              if (window.ethereum) {
                try {
                  await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [
                      {
                        chainId: '0xaa36a7', // Sepolia network chain ID

                      },
                    ],
                  });
                  // Reload the page after switching the network
                  window.location.reload();
                } catch (error) {
                  console.error("Error switching chain:");
                  console.error(error);
                }
              }
            }
            console.log("hello");
            const contract = new web3.eth.Contract(HasherAbi, HasherAddress);

            // Retrieve the name
            const hash = await contract.methods.hash(move, salt).call();
            setHashResult(hash);
            console.log(hash);
          }
          else {
            setConnectionStatus('Please connect MetaMask');
            try {
              await ethereum.request({ method: "eth_requestAccounts" })
              setConnectionStatus('Connected'); // Update button text
              const accounts = await ethereum.request({ method: "eth_accounts" })
              console.log(accounts)
            } catch (error) {
              console.log("error")
              console.log(error)
            }
          }
        }
      } catch (error) {
        window.location.reload();
        console.error(error);
      }
    } catch (error) {
      window.location.reload();
      console.log(error);
    }
  }


  async function connect() {
    console.log("1");
    try {
      console.log("2");
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
    catch (error) {
      console.log("error");
      console.log(error);
    }
  }



  async function initGame() { // Call the RPS contract : RPS function
    console.log("1");
    try {
      console.log("2");
      if (typeof window.ethereum !== "undefined") {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        try {
          await ethereum.request({ method: "eth_requestAccounts" })
          setConnectionStatus('Connected'); // Update button text
          const accounts = await ethereum.request({ method: "eth_accounts" })
          console.log(accounts[0])
          const contractRPS = new web3.eth.Contract(RPSAbi, RPSAddress);
          console.log(contractRPS);
          const amountInWei = web3.utils.toWei('0.01', 'ether');
          const init = await contractRPS.methods.RPSinit(hashResult, accounts[0]).send({ from: accounts[0], value: amountInWei });
        } catch (error) {
          console.log(error)
        }
      } else {
        setConnectionStatus('Please install MetaMask'); // Update button text
      }
    }
    catch (error) {
      console.log("error");
      console.log(error);
    }

  }

  return (
    <>
      <div>
        {/* <button onClick={connect}>Connect</button> */}
      </div>
      <div>
        <p>1 : Rock</p>
        <p>2 : Paper</p>
        <p>3 : Scissors</p>
        <p>4 : Spock</p>
        <p>5 : Lizard</p>
      </div>
      <h5>Move -------------------------------- Address</h5>
      <input type="text" value={move} onChange={handleMoveChange} placeholder="Enter move" />
      <input type="text" value={address} onChange={handleAddressChange} placeholder="Enter address" />
      {/* <input type="text" value={salt} onChange={handleSaltChange} placeholder="Enter salt" /> */}
      <button onClick={getHash}>Test</button>
      <div>
        <strong>Hash Result:</strong> {hashResult}
      </div>
      <div>
        <button onClick={initGame}>Get Address</button>
      </div>
    </>
  );
}

export default App;
