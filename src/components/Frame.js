import React from 'react';
import styles from './Frame.css'; // Import the scoped CSS

const Frame = ({ children }) => {
  return <div className={styles["frame-container"]}>{children}</div>;
};

export default Frame;
