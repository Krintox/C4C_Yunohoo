import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [dataCount, setDataCount] = useState(null);
  const [allData, setAllData] = useState([]);
  const [newData, setNewData] = useState({
    date: '',
    time: '',
    voltage: 0,
    current: 0,
    power: 0,
    units: 0
  });

  useEffect(() => {
    const init = async () => {
      // Connect to Ethereum network
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        try {
          // Request account access
          await window.ethereum.enable();

          // Get user account
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);

          // Initialize contract ABI
          const contractABI = [
            {
                "inputs": [
                    {
                        "internalType": "bool",
                        "name": "_exceeded",
                        "type": "bool"
                    }
                ],
                "name": "pushLimitStatus",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "_date",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "_time",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_voltage",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_current",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_power",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_units",
                        "type": "uint256"
                    }
                ],
                "name": "sendData",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "index",
                        "type": "uint256"
                    }
                ],
                "name": "getAllData",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getAllDataCount",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "userAddress",
                        "type": "address"
                    }
                ],
                "name": "getLimitStatus",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "index",
                        "type": "uint256"
                    }
                ],
                "name": "getUserData",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getUserDataCount",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "limitStatus",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "userAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "bool",
                        "name": "exceeded",
                        "type": "bool"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ]; 

          // Initialize contract address
          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = {
            address: '0xc4FbC95b4ACE764Aa6033ee3e0DEf233222cfD51',
            networks: {
              [networkId]: {
                address: '0xc4FbC95b4ACE764Aa6033ee3e0DEf233222cfD51'
              }
            }
          };

          // Load contract
          const contractInstance = new web3Instance.eth.Contract(
            contractABI,
            deployedNetwork && deployedNetwork.address,
          );
          setContract(contractInstance);

          // Fetch user data count
          const count = await contractInstance.methods.getUserDataCount().call({ from: accounts[0] });
          setDataCount(count);

        // Fetch all data
        const data = [];
        for (let i = 0; i < count; i++) {
        const entry = await contractInstance.methods.getUserData(i).call({ from: accounts[0] });
        // Convert voltage, power, and current to regular numbers
        const formattedEntry = [
            entry[0],
            entry[1],
            Number(entry[2]),  // Convert voltage to a regular number
            Number(entry[3]),  // Convert current to a regular number
            Number(entry[4]),  // Convert power to a regular number
            Number(entry[5])   // Convert units to a regular number
        ];
        data.push(formattedEntry);
        }
        setAllData(data);

        } catch (error) {
          console.error('Error initializing web3: ', error);
        }
      }
    };

    init();
  }, []);

  const handleSendData = async () => {
    try {
      await contract.methods.sendData(
        newData.date,
        newData.time,
        newData.voltage,
        newData.current,
        newData.power,
        newData.units
      ).send({ from: account });
      // After sending data, refresh data count and all data
      const count = await contract.methods.getUserDataCount().call({ from: account });
      setDataCount(count);
      const data = [];
      for (let i = 0; i < count; i++) {
        const entry = await contract.methods.getUserData(i).call({ from: account });
        data.push(entry);
      }
      setAllData(data);
      console.log(allData);
    } catch (error) {
      console.error('Error sending data: ', error);
    }
  };

  return (
    <div>
      <h1>My Data</h1>
      {account && (
        <div>
          <h2>Account: {account}</h2>
          <div>
            <h3>Send Data</h3>
            <div>
              <label>Date:</label>
              <input type="text" value={newData.date} onChange={(e) => setNewData({ ...newData, date: e.target.value })} />
            </div>
            <div>
              <label>Time:</label>
              <input type="text" value={newData.time} onChange={(e) => setNewData({ ...newData, time: e.target.value })} />
            </div>
            <div>
              <label>Voltage:</label>
              <input type="number" value={newData.voltage} onChange={(e) => setNewData({ ...newData, voltage: e.target.value })} />
            </div>
            <div>
              <label>Current:</label>
              <input type="number" value={newData.current} onChange={(e) => setNewData({ ...newData, current: e.target.value })} />
            </div>
            <div>
              <label>Power:</label>
              <input type="number" value={newData.power} onChange={(e) => setNewData({ ...newData, power: e.target.value })} />
            </div>
            <div>
              <label>Units:</label>
              <input type="number" value={newData.units} onChange={(e) => setNewData({ ...newData, units: e.target.value })} />
            </div>
            <button onClick={handleSendData}>Send Data</button>
          </div>
          <h3>Data Count: {dataCount}</h3>
          <h3>My Data</h3>
          <ul>
            {allData.map((entry, index) => (
              <li key={index}>
                Date: {entry[0]}, Time: {entry[1]}, Voltage: {entry[2]}, Current: {entry[3]}, Power: {entry[4]}, Units: {entry[5]}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;