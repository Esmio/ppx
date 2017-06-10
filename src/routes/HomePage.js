import React from 'react';
import { connect } from 'dva';
import styles from './HomePage.css';
import HomePageComponent from '../components/HomePage/HomePage';

function HomePage({ history, location }) {
  return (
    <div className={styles.normal}>
		<HomePageComponent />
    </div>
  );
}

export default connect()(HomePage);
