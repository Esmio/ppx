import React, { Component } from 'react';
import { type as TYPE } from '../../utils';
import { MDIcon } from '../../components/General';
import css from './styles/GameHistory.less';

const { transactionStateRefs } = TYPE;

class GameHistory extends Component { 
  constructor(props, context) {
    super(props, context);
    this.state = {
      collapse: false
    };
    this.onCollapseClick = this.onCollapseClick.bind(this);
    this.dispatch = this.props.dispatch;
  }
  componentWillMount() {
    this.dispatch({ type: 'orderModel/getOrderHistory' });    
  }
  onCollapseClick() {
    const { collapse } = this.state;
    this.setState({ collapse: !collapse });
  }
  renderBody() {
    const { orderHistory } = this.props;
    if (orderHistory && orderHistory.length) {
      return _.map(orderHistory, (listItem) => {
        const { gameNameInChinese, gameIssueNo, transactionState, transactionTimeuuid } = listItem;
        return (
          <div
            className={css.gameHistory_tableBodyRow} key={transactionTimeuuid}
          >
            <div className={css.gameHistory_tableCell}>
              { gameNameInChinese }
            </div>
            <div className={css.gameHistory_tableCell}>
              { gameIssueNo }
            </div>
            <div data-state={transactionState} className={css.gameHistory_tableCell}>
              { transactionStateRefs[transactionState] }
            </div>
          </div>
        );
      });
    } return (
      <div className={css.gameHistory_tableBodyRow} >
        <div className={css.gameHistory_tableCell}>
          暂无数据
        </div>
      </div>
    );
  }
  render() {
    return (
      <div className={css.gameHistory}>
        <div className={css.gameHistory_table}>
          <div className={css.gameHistory_tableHeadRow}>
            <div className={css.gameHistory_tableCell}>彩种</div>
            <div className={css.gameHistory_tableCell}>期号</div>
            <div className={css.gameHistory_tableCell}>盈亏</div>
          </div>
          <div
            data-collapse={this.state.collapse}
            className={css.gameHistory_tableBody}
          >
            { this.renderBody() }
          </div>
          <div
            className={css.gameHistory_tableFooterRow}
          >
            <div className={css.gameHistory_tableCell}>
              <button
                className={css.gameHistory_tableFooterBtn}
              >
                <MDIcon iconName="refresh" /><i>刷新</i>
              </button>
            </div>
            <div className={css.gameHistory_tableCell}>
              <button 
                onClick={this.onCollapseClick}
                className={css.gameHistory_tableFooterBtn}
                data-collapse={this.state.collapse}
              >
                <MDIcon
                  iconName={this.state.collapse ? 'chevron-double-down' : 'chevron-double-up'}
                />
              </button>                
            </div>
            <div className={css.gameHistory_tableCell}>
              <button className={css.gameHistory_tableFooterBtn}>
                <MDIcon iconName="open-in-new" /><i>更多</i>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

GameHistory.propTypes = {

};

export default GameHistory;
