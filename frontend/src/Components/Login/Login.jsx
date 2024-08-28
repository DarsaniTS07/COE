import React, { useState } from "react";
import axios from 'axios';
import PropTypes from "prop-types";

const Login = ({setUserEmail}) =>{
   const[input,setInput]=useState({
    email:'',
    password:''
   });

   const [error,setError] = useState('');

   const handleChange = (e) =>{
    const { name,value} = e.target;
    setInput({
        ...input,
        [name]:value
    });
   };

   const handleSubmit = async (e) =>{
    e.preventDefault();
    try{
        const response = await axios.post('http://localhost:5001/login',input);
        console.log('Form Submitted:',response.data);
        if(response.status == 200){
            setUserEmail(input.email);
            window.location.href = '/dashboard';
        }
    }catch(err){
        console.error('Error during login',err);
        if(err.response && err.response.status === 400){
            alert("Invalid email or password")
        }else{
            setError("An error occurred.Please try Again")
        }
            
    }

   };

    return(
        <div className="login-first">
            <form onSubmit={handleSubmit}>
            <input
            className="email"
            type="email"
            name="email"
            placeholder="Email"
            value={input.email}
            onChange={handleChange}
            />
            <input
            className="password"
            type="password"
            name="password"
            placeholder="Password"
            value={input.password}
            onChange={handleChange}
            />
            <button 
            type="submit"
            >Login</button>
            </form>
            {error && <p className="error">{error}</p>}

        </div>

    );
};

Login.propTypes = {
    setUserEmail: PropTypes.func.isRequired,  // Ensure setUserEmail is passed in as prop
  };

export default Login;