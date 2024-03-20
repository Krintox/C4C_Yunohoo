import {Link} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "./UserContext";

export default function Header() {
  const {setUserInfo,userInfo} = useContext(UserContext);
  useEffect(() => {
    fetch('http://localhost:4000/profile', {
      credentials: 'include',
    }).then(response => {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  function logout() {
    fetch('http://localhost:4000/logout', {
      credentials: 'include',
      method: 'POST',
    });
    setUserInfo(null);
  }

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">Lu<span>mos</span></Link>
      <nav>
        {username && (
          <>
            <Link to="/create" className="nav-icon">Post +</Link>
            <a target="_blank" href="http://localhost:3000/" className="nav-icon">Energy Marketplace</a>
            <Link to="/livedata" className="nav-icon">Monitor Live Data</Link>
            <a onClick={logout} className="nav-icon">Logout ({username})</a>
          </>
        )}
        {!username && (
          <>
            <Link to="/login" className="nav-icon">Login</Link>
            <Link to="/register" className="nav-icon">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
