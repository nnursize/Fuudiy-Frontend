// src/components/Frame.js
import React from 'react';
import styles from './Frame.css';

const Frame = ({ title, onSubmit, children }) => {
  return (
    <div className="wrapper">
      <div className={styles["frame-container"]}>
        <form onSubmit={onSubmit}>
          {children}
        </form>
      </div>
    </div>
  );
};

export default Frame;
