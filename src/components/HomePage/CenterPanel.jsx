import React, { Component } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import LotteryCounter from './LotteryCounter';

class CenterPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allGameInfos: null,
      highFreqLotId: ['HF_CQSSC', 'HF_BJPK10', 'HF_SHD11'],
      lowFreqLotId: ['MARK_SIX', 'X3D'],
      highFreqList: null,
      lowFreqList: null
    };
  }
  componentWillMount() {
    this.updateLotteriesList(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.updateLotteriesList(nextProps);
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.tabHasntSelect(prevProps) && this.listIsReady(prevState)) {
      const { highFreqList, lowFreqList, highFreqLotId, lowFreqLotId } = this.state;
      // console.debug('componentDidUpdate', this.state);
      this.tabSelectionHandler('highFreq', highFreqList[highFreqLotId[0]].gameNameInChinese);
      this.tabSelectionHandler('lowFreq', lowFreqList[lowFreqLotId[0]].gameNameInChinese);
    }
  }
  getLotteriesContent(list) {
    const { allGameInfos } = this.state;
    const { allHistory } = this.props;
    const newListObject = {};
    _.forEach(list, (id) => {
      const info = _.find(allGameInfos, ['gameUniqueId', id]);
      const history = _.find(allHistory, ['gameUniqueId', id]);
      newListObject[id] = { ...history, ...info };
    });
    return newListObject;
  }
  getDOMHeight(name, DOM) {
    const { dispatch } = this.props;
    if (DOM) {
      dispatch({
        type: 'layoutModel/getDOMHeight',
        payload: { name, height: DOM.offsetHeight }
      });
    }
  }
  gameInfosReady({ allHistory, gameInfosHot, gameInfosRecommend }) {
    return allHistory && gameInfosHot && gameInfosRecommend;
  }
  tabHasntSelect({ highFreqSelectedContent, lowFreqSelectedContent }) {
    return !highFreqSelectedContent && !lowFreqSelectedContent;
  }
  listIsReady({ highFreqList, lowFreqList }) {
    return highFreqList && lowFreqList;
  }
  updateLotteriesList({ allHistory, gameInfosHot, gameInfosRecommend }) {
    const { highFreqLotId, lowFreqLotId } = this.state;    
    if (this.gameInfosReady({ allHistory, gameInfosHot, gameInfosRecommend })) {
      // console.debug('updateLotteriesList', allHistory, gameInfosHot, gameInfosRecommend);
      const highFreqList = this.getLotteriesContent(highFreqLotId);
      const lowFreqList = this.getLotteriesContent(lowFreqLotId);
      this.setState({
        allGameInfos: [...gameInfosHot, ...gameInfosRecommend],
        highFreqList,
        lowFreqList
      });
    }
  }
  selectTab(payload) {
    const { dispatch } = this.props;
    if (payload.tabContent) {
      dispatch({
        type: 'homeInfoModel/selectTab',
        payload
      });
    }
  }
  tabSelectionHandler(frequency, tabName) {
    const targetList = this.state[`${frequency}List`];
    this.selectTab({
      frequency,
      tabName,
      tabContent: _.find(targetList, ['gameNameInChinese', tabName])
    });
  }
  renderLotteryCounter(frequency) {
    return (
      <LotteryCounter
        lotteryList={this.state[`${frequency}List`]}
        tabsName={_.map(this.state[`${frequency}List`], 'gameNameInChinese')}
        selectedTab={this.props[`${frequency}SelectedTab`]}
        selectTab={(tabName) => this.tabSelectionHandler.bind(this, frequency, tabName)}
        tabContent={this.props[`${frequency}SelectedContent`]}
      />
    );
  }
  render() {
    const { highFreqList, lowFreqList } = this.state;
    return (
      <div ref={DOM => this.getDOMHeight('lotteryCounters', DOM)}>
        { highFreqList && this.renderLotteryCounter('highFreq') }
        { lowFreqList && this.renderLotteryCounter('lowFreq') }
      </div>
    );
  }
}

const mapStatesToProps = ({ homeInfoModel, layoutModel, gameInfosModel }) => {
  const {
    highFreqSelectedTab,
    lowFreqSelectedTab,
    highFreqSelectedContent,
    lowFreqSelectedContent,
  } = homeInfoModel;
  const { allHistory, gameInfosHot, gameInfosRecommend } = gameInfosModel;
  const { lotteryCountersHeight } = layoutModel;
  return {
    allHistory,
    gameInfosHot,
    gameInfosRecommend,
    highFreqSelectedTab,
    lowFreqSelectedTab,
    highFreqSelectedContent,
    lowFreqSelectedContent,
    lotteryCountersHeight
  };
};

export default connect(mapStatesToProps)(CenterPanel);
