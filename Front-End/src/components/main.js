import React from 'react'
import "../Styles/main.css"
import { Navigate, useNavigate } from 'react-router-dom';

export default function Main() {
    const navigate = useNavigate();
    const handlebutton = ()=>{
        navigate('/login')
    }
  return (
    <div className="main">
      <button className="login-button" onClick={handlebutton}>Login</button>
      <img src="https://files.prepinsta.com/wp-content/uploads/2022/05/Hexaware-interview-questions.webp" alt='icon' className='company-image'></img>
    </div>
  )
}
