import React from 'react';
import UserForm from './components/userComponents/UserForm';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';
import "./index.css";
import CheckInternetConnection from './components/CheckInternetConnection';

const isStandalone = !window.__POWERED_BY_HOST__; 

const App = ({updating}) => {
  
  const content = (
    <CheckInternetConnection >
      <UserForm update={updating} />
      <ToastContainer />
    </CheckInternetConnection>
  );

  return isStandalone ? <BrowserRouter>{content}</BrowserRouter> : content;
};

export default App;
