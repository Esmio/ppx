import React, { Component } from 'react';
import LotteryTabs from './LotteryTabs';
import LotteryTabsBody from './LotteryTabsBody';
import { Row, Loader } from '../General/';
import css from '../../styles/homepage/lotteryTabs.less';

class LotteryCounter extends Component {
  constructor() {
    super();
    this.state = {
      lotMultiply: 1,
      lotteryNumbers: [],
      elHeight: null
    };
    this.height = 0;
  }
  componentWillMount() {
    const { selectTab, tabContent, tabsName } = this.props;
    if (tabsName) {
      selectTab(tabsName[0]);
    }
    if (tabContent) {
      const { lotteryCount } = tabContent;
      this.getLotteryNumbers(lotteryCount);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.tabContent && nextProps.tabContent.openCode) {
      const { openCode } = nextProps.tabContent;
      this.getLotteryNumbers(openCode.length);
      this.setState({ lotMultiply: 1 });
    }
  }
  getLotteryNumbers(lotteryCount) {
    const lotteryNumbers = [];
    for (let i = lotteryCount; i > 0; i--) {
      const randomNumber = Math.floor(Math.random() * 10);
      lotteryNumbers.push(randomNumber);
    }
    this.setState({ lotteryNumbers });
  }
  setLotMultiply(lotMultiply) {
    if (lotMultiply >= 1 && lotMultiply <= 99999) {
      this.setState({ lotMultiply });
    } else if (lotMultiply <= 0) {
      this.setState({ lotMultiply: 1 });
    } else if (lotMultiply >= 99999) {
      this.setState({ lotMultiply: 99999 });
    }
  }
  toggleLotMultiply(ctrl) {
    const { lotMultiply } = this.state;
    const lotMultiplyNum = Number(lotMultiply);
    if (ctrl === 'minus') {
      this.setLotMultiply(lotMultiplyNum - 1);
    } else if (ctrl === 'plus') {
      this.setLotMultiply(lotMultiplyNum + 1);
    }
  }
  calcHeight(el) {
    if (el && !this.state.elHeight) {
      this.height = el.offsetHeight;
      if (this.state.height !== this.height) {
        this.setState({ height: this.height });
      }
    }
  }
  renderScene() {
    const { lotteryList, selectedTab, selectTab, tabsName, tabContent } = this.props;
    console.log('selectTab', selectTab)
    const { lotMultiply } = this.state;
    if (lotteryList) {
      return (
        <Row>
          <div ref={(el) => { this.calcHeight(el); }}>
            <LotteryTabs
              tabsName={tabsName}
              selectedTab={selectedTab}
              selectTab={selectTab}
            />
            <LotteryTabsBody
              tabsName={tabsName}
              tabContent={tabContent}
              lotteryNumbers={tabContent}
              lotMultiply={lotMultiply}
              getLotteryNumbers={this.getLotteryNumbers.bind(this)}
              setLotMultiply={this.setLotMultiply.bind(this)}
              toggleLotMultiply={this.toggleLotMultiply.bind(this)}
            />
          </div>
        </Row>
      );
    }
    return <Loader />;
  }

  render() {
    return (
      <div className={css.lottery_body}>
        { this.renderScene() }
      </div>
    );
  }
}

export default LotteryCounter;
