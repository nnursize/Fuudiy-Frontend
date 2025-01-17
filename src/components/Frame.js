// src/components/Frame.js
import React from 'react';
import './LoginRegister.css';

const Frame = ({ children, title, onSubmit }) => {
  return (
    <div className="wrapper">
      <div className="form-box">
        <form onSubmit={onSubmit}>
          <h1>{title}</h1>
          {children} {/* Render children (e.g., input fields, buttons) here */}
        </form>
      </div>
    </div>
  );
};

export default Frame;
