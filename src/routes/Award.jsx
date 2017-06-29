import React, { Component } from 'react';
import { connect } from 'dva';
import AwardTable from '../components/Award/AwardTable';
import styles from './Award.css';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/FooterBar';

class Award extends Component {
  constructor() {
    super();
    this.getAllHistory = this.getAllHistory.bind(this);
  }

  componentDidMount() {
    this.getAllHistory();
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }

  getAllHistory() {
    const { dispatch } = this.props;
    this.timer && clearTimeout(this.timer);
    dispatch({ type: 'gameInfosModel/getAllHistory' });
    this.timer = setTimeout(() => {
      this.getAllHistory();
    }, 20000);
  }

  render() {
    const props = this.props;
    const tableProps = {
      dataSource: props.allHistory,
    };
    return (
      <div className={styles.normal}>
        <Header/>
        <AwardTable {...tableProps} />
        <Footer/>
      </div>
    );
  }
}

Award.propTypes = {


};

Award.defaultProps = {

};

export default connect(({ gameInfosModel }) => gameInfosModel)(Award);
