import React, { Component } from 'react';

import { Row, Column } from '../General/';
import css from '../../styles/homepage/lotteryTabs.less';

class LotteryTabs extends Component {
  selectTabHandler(tabName) {
    const { selectTab } = this.props;
    selectTab(tabName);
  }
  renderTabs(tabsName) {
    const { selectedTab, selectTab } = this.props;
    console.log('lotteryTabs', selectTab);
    const tabWidth = 100 / tabsName.length;
    if (tabsName) {
      return (
        <Row className={css.lotteryTab_bars}>
          {
            tabsName.map((tabName, index) => {
              const isActiveTab = tabName === selectedTab;
              return (
                <Column 
                  key={index}
                  width={`${tabWidth}%`}
                  className={css[`lotteryTab_bar${isActiveTab ? '__active' : ''}`]}
                >
                  <button
                    className={css.lotteryTab_barBtn}
                    onClick={selectTab(tabName)}
                  >
                    {tabName}
                  </button>
                </Column>
              );
            })
          }
        </Row>
      );
    }

    return null;
  }

  render() {
    const { tabsName } = this.props;
    return (
      <div>
        { tabsName && this.renderTabs(tabsName) }
      </div>
    );
  }
}

export default LotteryTabs;
