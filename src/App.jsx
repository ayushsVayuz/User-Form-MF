import React from 'react';
import UserForm from './components/userComponents/UserForm';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';

const isStandalone = !window.__POWERED_BY_HOST__; 

const App = ({updating}) => {
  
  const content = (
    <div >
      <UserForm update={updating} />
      <ToastContainer />
    </div>
  );

  return isStandalone ? <BrowserRouter>{content}</BrowserRouter> : content;
};

export default App;
