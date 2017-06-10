import React from 'react';
import { connect } from 'dva';
import styles from './IndexPage.css';

function IndexPage({ data, dispatch }) {
  function test() {
  dispatch({
    type: 'homePage/test'
  });
  }
  return (
    <div className={styles.normal}>
      {console.log('data', data)}
      <h1 onClick={test} className={styles.title}>Yay! Welcome to dva!</h1>
      <div className={styles.welcome} />
    </div>
  );
}


function mapStatesToProps(state) {
 const { data } = state.homePage;
 return { data };
}

export default connect(mapStatesToProps)(IndexPage);
