import logo from '../logo_3.png';
import fullLogo from '../full_logo.png';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

function Navbar() {

const [connected, toggleConnect] = useState(false);
const location = useLocation();
const [currAddress, updateAddress] = useState('0x');

async function getAddress() {
  const ethers = require("ethers");
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const addr = await signer.getAddress();
  updateAddress(addr);
}

function updateButton() {
  const ethereumButton = document.querySelector('.enableEthereumButton');
  ethereumButton.textContent = "Connected";
  ethereumButton.classList.remove("hover:bg-blue-70");
  ethereumButton.classList.remove("bg-blue-500");
  ethereumButton.classList.add("hover:bg-green-70");
  ethereumButton.classList.add("bg-green-500");
}

async function connectWebsite() {

    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if(chainId !== '0x5')
    {
      //alert('Incorrect network! Switch your metamask network to Rinkeby');
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x5' }],
     })
    }  
    await window.ethereum.request({ method: 'eth_requestAccounts' })
      .then(() => {
        updateButton();
        console.log("here");
        getAddress();
        window.location.replace(location.pathname)
      });
}

  useEffect(() => {
    if(window.ethereum == undefined)
      return;
    let val = window.ethereum.isConnected();
    if(val)
    {
      console.log("here");
      getAddress();
      toggleConnect(val);
      updateButton();
    }

    window.ethereum.on('accountsChanged', function(accounts){
      window.location.replace(location.pathname)
    })
  });

    return (
      <div className="w-1/3">
        <nav className="w-screen">
          <ul className='items-end justify-between py-3 bg-transparent text-white pr-5'>
          <li className='items-end ml-5 pb-2'>
            <Link to="/">
            <div className='inline-block font-bold text-xl ml-2'>
              Energy Marketplace
            </div>
            </Link>
          </li>
          <li className='w-2/6'>
            <ul className='font-bold mr-10 text-lg main-ul'>
              <div>
                <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={connectWebsite}>{connected? "Connected":"Connect Wallet"}</button>
              </div>
              <div>
                {currAddress !== "0x" ? "Connected to":"Not Connected. Please login to view NFTs"} {currAddress !== "0x" ? (currAddress.substring(0,15)+'...'):""}
              </div>  <br></br><br></br>
              {location.pathname === "/" ? 
              <li className='p-2'>
                <Link to="/">Marketplace</Link>
              </li>
              :
              <li className=' p-2'>
                <Link to="/">Marketplace</Link>
              </li>              
              }
              {location.pathname === "/sellenergy" ? 
              <li className='p-2'>
                <Link to="/sellenergy">List My Energy</Link>
              </li>
              :
              <li className=' p-2'>
                <Link to="/sellenergy">List My Energy</Link>
              </li>              
              }              
              {location.pathname === "/profile" ? 
              <li className='p-2'>
                <Link to="/profile">Profile</Link>
              </li>
              :
              <li className=' p-2'>
                <Link to="/profile">Profile</Link>
              </li>              
              }
            </ul>
          </li>
          </ul>
        </nav>
      </div>
    );
  }

  export default Navbar;