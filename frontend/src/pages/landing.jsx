import React from 'react';
import "../App.css"
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function Landing() {

  const router = useNavigate();

  return (
    <div className='landingPageContainer'>
      <nav>
        <div className='navHeader'>
            <h1>Naxon</h1>
        </div>
        <div className='navList'>
            <p onClick={() => {
              router('/guest');
            }}>Join as Guest</p>

            <p onClick={() => {
              router('/auth');
            }} role='button'>Register</p>

            <div onClick={() => {
              router('/auth');
            }} role='button'>
                <p> Login </p>
            </div>
        </div>
      </nav>

      <div className='landingContent'> 
        <div className='landingText'>
            <h1><span style={{ color: "#FF9839" }}>Connect</span> with Your Loves Ones</h1>
            <p>Your gateway to seamless collaboration and productivity.</p>
            <div className='button'>
                <Link to={"/auth"} style={{ textDecoration: "none" }}>Get Started</Link>
            </div>
        </div>
        <div className='landingImage'>
            <img src="/mobile.png" alt="Collaboration" />
        </div>
      </div>
    </div>
  );
}

