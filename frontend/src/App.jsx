
import React,{useState} from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/Login/Login';
import Dashboard from './Components/Dashboard/Dashboard';
import './App.css';

function App() {
  const [userEmail, setUserEmail] = useState('');
  return (
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<Login setUserEmail={setUserEmail}/>} />
            <Route path='/dashboard' element={<Dashboard userEmail={userEmail}/>} />
          </Routes>
        </div>
      </Router>
  );
}

export default App
