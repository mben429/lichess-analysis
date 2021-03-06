import React from 'react';
import logo from './logo.svg';
import './App.css';
import { UsernameForm } from './views/UsernameForm'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { VisualizeData } from './views/VisualizeData';

function App() {
    {/*
    <div className="app-body">
      <UsernameForm /> 
    </div>
    */}
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UsernameForm />} />
        <Route path="/insights/:username" element={<VisualizeData />} />
      </Routes>
    </Router>
  
  );
}

export default App;
