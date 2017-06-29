import React, { Component } from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { Spin } from 'antd';
import { settingMap, cleanEmptyObj, hasTrendChart } from '../../utils';
import { LoadingBar } from '../General';
import { betService } from '../../services';
import UserProfile from '../User';
import SideNav from '../SideNav/SideNav';
import TopTray from '../Header/TopTray';
import Login from '../Header/Login';
import GameNav from './GameNav';
import GameSubNav from './GameSubNav';
import GameHeader from './GameHeader';
import GameOpenOption from './GameOpenOption';
import GameBoard from './GameBoard';
import GameCal from './GameCal';
import GameCart from './GameCart';
import GameHistory from './GameHistory';
import ReturnRatioCtrl from './ReturnRatioCtrl';

import css from './styles/BetCenterIndex.less';
import logo from '../../assets/image/logo.png';

const { gamesMap, gameSettingsMap } = settingMap;
const { getRandomPicks, getBetString, getOpenOptionsString, getNumberOfUnits } = betService;

class BetCenterIndex extends Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch.bind(this);
    this.getAmount = this.getAmount.bind(this);
    this.getAmountPerUnit = this.getAmountPerUnit.bind(this);
    this.getEntriesTotal = this.getEntriesTotal.bind(this);
    this.getNumberOfUnits = getNumberOfUnits.bind(this);
    this.onAddEntry = this.onAddEntry.bind(this);
    this.onBetClick = this.onBetClick.bind(this);
    this.onControllerClick = this.onControllerClick.bind(this);
    this.onCountDownFinish = this.onCountDownFinish.bind(this);
    this.onEditBetClick = this.onEditBetClick.bind(this);
    this.onInitializeClick = this.onInitializeClick.bind(this);
    this.onMethodSelect = this.onMethodSelect.bind(this);
    this.onMissingClick = this.onMissingClick.bind(this);
    this.onMultipleChange = this.onMultipleChange.bind(this);
    this.onNavSelect = this.onNavSelect.bind(this);
    this.onPostEntryClick = this.onPostEntryClick.bind(this);
    this.onQuickBetClick = this.onQuickBetClick.bind(this);
    this.onRandomClick = this.onRandomClick.bind(this);
    this.onRemoveAll = this.onRemoveAll.bind(this);
    this.onRemoveSingle = this.onRemoveSingle.bind(this);
    this.onReturnRatioChange = this.onReturnRatioChange.bind(this);
    this.onUnitToggle = this.onUnitToggle.bind(this);
    this.setCurrentBetInfos = this.setCurrentBetInfos.bind(this);
    this.setInitialOption = this.setInitialOption.bind(this);
    this.setInitialResponseState = this.setInitialResponseState.bind(this);
    this.setNav = this.setNav.bind(this);
    this.setNumberOfUnits = this.setNumberOfUnits.bind(this);
    this.setState = this.setState.bind(this);
    this.setSubNav = this.setSubNav.bind(this);
    this.setThisGamePrize = this.setThisGamePrize.bind(this);
    this.setThisMethodSetting = this.setThisMethodSetting.bind(this);
  }
  componentWillMount() {
    this.dispatch({ type: 'betCenter/getCurrentGameResult' });
    this.dispatch({ type: 'gameInfosModel/getAllGamesSetting' });
    this.setCurrentGameInfos(this.props);
    this.setThisGameSetting(this.props);
    this.setThisGamePrize(this.props);    
  }
  componentWillReceiveProps(nextProps) {
    this.setCurrentGameInfos(nextProps);
    if (this.props.thisGameId !== nextProps.thisGameId) {
      this.dispatch({ type: 'betCenter/getCurrentGameResult' });
      this.dispatch({ type: 'orderModel/getOrderHistory' });
      this.setThisGameSetting(nextProps);
      this.setThisGamePrize(nextProps);    
    }
    if (this.props.allGamesPrizeSettings !== nextProps.allGamesPrizeSettings) {
      this.setThisGamePrize(nextProps);
    }
    if (this.props.methodGroup !== nextProps.methodGroup) {
      this.setSubNav(nextProps);
    }
    if (
      this.props.allGamesPrizeSettings !== nextProps.allGamesPrizeSettings ||
      this.props.methodId !== nextProps.methodId ||
      this.props.gameMethod !== nextProps.gameMethod
    ) {
      this.setThisMethodSetting(nextProps);
    }
    if (nextProps.thisMethodSetting &&
      (this.props.thisMethodSetting !== nextProps.thisMethodSetting)
    ) {
      this.setInitialOption(nextProps);  
      this.setCurrentBetInfos(nextProps);
    }
    if (
      this.props.allBetObj !== nextProps.allBetObj ||
      this.props.allOpenOptions !== nextProps.allOpenOptions
    ) {
      this.setCurrentBetInfos(nextProps);      
    }
    if (this.props.thisBetString !== nextProps.thisBetString) {
      this.setNumberOfUnits(nextProps);   
    }
  }
  componentWillUnmount() {
    this.dispatch({
      type: 'betCenter/initializeState',
      payload: [
        'methodGroup', 'gameMethod', 'methodId', 'allOpenOptions',
        'allBetObj', 'betEntries', 'current', 'lastOpen'
      ]
    });
  }
  onInitializeClick() {
    const { allBetObj, methodId } = this.props;
    const newAllBetObj = { ...allBetObj };
    newAllBetObj[methodId] = {};
    this.dispatch({
      type: 'betCenter/initializeState',
      payload: [
        'amount', 'amountUnit', 'initialAmount', 'multiply',
        'numberOfUnits', 'returnMoneyRatio', 'thisBetObj'
      ]
    });
    this.dispatch({
      type: 'betCenter/updateState', payload: { allBetObj: newAllBetObj }
    });
  }
  onMissingClick() {
    const { thisGameId } = this.props;
    if (!hasTrendChart(thisGameId)) {
      return false;
    }
    this.dispatch(routerRedux.push({
      pathname: 'trend', 
      query: {
        gameUniqueId: thisGameId
      }
    }));
  }
  onUnitToggle(amountUnit) {
    this.dispatch({ type: 'betCenter/updateState', payload: { amountUnit } });
  }
  onMultipleChange(multiply) {
    if (multiply > 0) {
      this.dispatch({ type: 'betCenter/updateState', payload: { multiply } });
    } else {
      this.dispatch({ type: 'betCenter/updateState', payload: { multiply: 1 } });
    }
  }
  onQuickBetClick() {
    this.onAddEntry();
    this.onPostEntryClick();
  }
  onNavSelect(methodGroup) {
    this.dispatch({ type: 'betCenter/initializeState', payload: ['methodId', 'gameMethod'] });
    this.dispatch({ type: 'betCenter/updateState', payload: { methodGroup } });
  }
  onCountDownFinish() {
    this.dispatch({ type: 'betCenter/getCurrentGameResult' });
  }
  onRemoveAll() {
    this.dispatch({ type: 'betCenter/initializeState', payload: ['betEntries'] });
  }
  onRemoveSingle(id) {
    const { betEntries } = this.props;
    const newBetEntries = _.reject(betEntries, ['id', id]);
    this.dispatch({ type: 'betCenter/updateState', payload: { betEntries: newBetEntries } });
  }
  onReturnRatioChange(returnMoneyRatio) {
    this.dispatch({
      type: 'betCenter/updateState',
      payload: { returnMoneyRatio: _.toNumber(returnMoneyRatio) }
    });
  }
  onEditBetClick(id) {
    const { betEntries, allBetObj, allOpenOptions } = this.props;
    const newAllBetObj = { ...allBetObj };
    const newAllOpenOptions = { ...allOpenOptions };
    const thisBetEntry = _.find(betEntries, ['id', id]);
    this.onRemoveSingle(id);
    const {
      amountUnit,
      thisBetObj,
      gameMethod,
      gameplayMethod,
      methodGroup,
      multiply,
      thisOpenOption,
      returnMoneyRatio
    } = thisBetEntry;
    newAllBetObj[gameplayMethod] = thisBetObj;
    newAllOpenOptions[gameplayMethod] = thisOpenOption;
    this.dispatch({
      type: 'betCenter/updateState',
      payload: {
        methodId: gameplayMethod,
        allBetObj: newAllBetObj,
        allOpenOptions: newAllOpenOptions,
        methodGroup,
        gameMethod,
        multiply,
        amountUnit,
        returnMoneyRatio
      },
    });
  }
  onBetClick({ section, bet }) {
    const {
      methodId, allBetObj, thisMethodSetting, thisBetObj
    } = this.props;
    const { gameRules } = thisMethodSetting;
    const newAllBetObj = { ...allBetObj };
    let thisNewBetObj = { ...thisBetObj };
    
    if (thisNewBetObj[section] && thisNewBetObj[section].length) {
      const betIndex = thisNewBetObj[section].indexOf(bet);
      if (betIndex > -1) {
        thisNewBetObj[section].splice(betIndex, 1);
      } else {
        thisNewBetObj[section].push(bet);
      }
    } else {
      thisNewBetObj[section] = thisNewBetObj[section] || [];
      thisNewBetObj[section].push(bet);
    }
    if (gameRules.isUnique) {
      _.forEach(thisNewBetObj, (existingSection, existingSectionName) => {
        if (existingSectionName !== section && existingSection.indexOf(bet) > -1) {
          const duplicateBetIndex = existingSection.indexOf(bet);
          const duplicateSection = thisNewBetObj[existingSectionName];
          thisNewBetObj[existingSection] = duplicateSection.splice(duplicateBetIndex, 1);
        }
      });
    }
    
    thisNewBetObj = cleanEmptyObj(thisNewBetObj);
    newAllBetObj[methodId] = thisNewBetObj;
    this.dispatch({
      type: 'betCenter/updateState',
      payload: { allBetObj: newAllBetObj }
    });
  }
  onControllerClick({ section, group }) {
    const { allBetObj, methodId, thisMethodSetting } = this.props;
    const { thisBetObj } = this.state;
    const { gameRules } = thisMethodSetting;
    const newAllBetObj = { ...allBetObj };
    let thisNewBetObj = { ...thisBetObj };
    if (gameRules.isUnique) {
      _.forEach(thisNewBetObj, (existingSection, existingSectionName) => {
        if (existingSection !== section) {
          const otherSection = thisNewBetObj[existingSectionName];
          const differences = _.difference(otherSection, group);
          thisNewBetObj[existingSectionName] = differences;
        }
      });
    }
    thisNewBetObj[section] = group;
    thisNewBetObj = cleanEmptyObj(thisNewBetObj);
    newAllBetObj[methodId] = thisNewBetObj;
    this.dispatch({
      type: 'betCenter/updateState',
      payload: { allBetObj: newAllBetObj }
    });
  }
  onRandomClick() {
    const { methodId, allBetObj, thisMethodSetting } = this.props;
    const newAllBetObj = { ...allBetObj };
    const randomPick = getRandomPicks(thisMethodSetting.gameRules);
    newAllBetObj[methodId] = randomPick;
    this.dispatch({
      type: 'betCenter/updateState',
      payload: { allBetObj: newAllBetObj }
    });
  }
  onMethodSelect({ gameMethod, methodId }) {
    this.setState({ thisGameRules: '' });
    this.dispatch({ type: 'betCenter/updateState', payload: { gameMethod, methodId } });
  }
  onPostEntryClick() {
    const { thisGameHistory } = this.state;
    const { totalAmount, totalUnits } = this.getEntriesTotal();
    this.dispatch({
      type: 'betCenter/postBetEntries',
      payload: {
        numberOfUnits: totalUnits,
        totalAmount,
        thisGameHistory
      }
    });
  }
  onAddEntry() {
    const {
      methodId, betEntries, gameMethod, methodGroup,
      numberOfUnits, multiply, amountUnit, returnMoneyRatio,
      thisBetObj, thisOpenOption, thisBetString
    } = this.props;
    const newBetEntries = [...betEntries];
    
    const sectionKeys = _.join(_.keys(thisBetObj), '_');
    const id = `${methodId}__${sectionKeys}__${thisBetString}`;
    const amount = this.getAmount();
    const pricePerUnit = this.getAmountPerUnit();
    const entry = {
      amount,
      amountUnit,
      betString: thisBetString,
      thisBetObj,
      gameMethod,
      gameplayMethod: methodId,
      id,
      methodGroup,
      multiply,
      numberOfUnits,
      thisOpenOption,
      pricePerUnit,
      returnMoneyRatio,
    };
    newBetEntries.push(entry);
    this.dispatch({ type: 'betCenter/updateState', payload: { betEntries: newBetEntries } });
    this.dispatch({
      type: 'betCenter/initializeState', payload: ['allBetObj', 'thisBetObj', 'thisBetString']
    });
  }
  getAmount() {
    const { multiply, numberOfUnits, amountUnit } = this.props;
    let amount = 2 * multiply * numberOfUnits * amountUnit;    
    amount = amount.toFixed(2);
    amount = _.toNumber(amount);
    return amount;
  }
  getAmountPerUnit() {
    const { multiply, amountUnit } = this.props;
    let amount = 2 * multiply * amountUnit;    
    amount = amount.toFixed(2);
    amount = _.toNumber(amount);
    return amount;
  }
  getEntriesTotal() {
    const { betEntries } = this.props;
    let totalAmount = 0;
    let totalUnits = 0;
    _.forEach(betEntries, (entry) => {
      const { amount, numberOfUnits } = entry;
      totalAmount += amount;
      totalUnits += numberOfUnits;
    });
    return { totalAmount, totalUnits };
  }
  setInitialResponseState() {
    this.dispatch({
      type: 'betCenter/initializeState', payload: ['responseMessage', 'responseColor']
    });
  }
  setInitialOption({ thisMethodSetting, methodId, allOpenOptions }) {
    const newAllOpenOptions = { ...allOpenOptions };
    const thisOpenOption = allOpenOptions[methodId] || [];
    if (thisMethodSetting.gameRules.openOptions) {
      const { gameRules } = thisMethodSetting;
      const { uniqueInt, openOptions } = gameRules;
      const defaultOption = _.slice(openOptions, 0, uniqueInt);
      if (openOptions && !thisOpenOption.length) {
        newAllOpenOptions[methodId] = defaultOption;
        this.dispatch({
          type: 'betCenter/updateState', payload: { allOpenOptions: newAllOpenOptions }
        });
      }
    }
  }
  setThisGameSetting({ thisGameId }) {
    // console.log('setting thisGameSetting...', thisGameId);
    const thisGameMap = _.find(gamesMap, ['gameUniqueId', thisGameId]);
    const mapKey = thisGameMap.gameSettingsMap;
    const thisGameSetting = gameSettingsMap[mapKey];
    this.dispatch({
      type: 'betCenter/updateState',
      payload: { thisGameSetting }
    });
    this.setNav({ thisGameSetting });
  }
  setNav({ thisGameSetting }) {
    const gameNav = [];
    _.forEach(thisGameSetting, (method) => {
      const { gameMethod } = method;
      const nameArray = _.split(gameMethod, '-');
      if (gameNav.indexOf(nameArray[0]) < 0) {
        gameNav.push(nameArray[0]);
      }
    });
    this.dispatch({
      type: 'betCenter/updateState',
      payload: {
        gameNav, methodGroup: gameNav[0], gameSubNav: ''
      }
    });
  }
  setSubNav({ thisGameSetting, methodGroup }) {
    const gameSubNav = {};
    const thisGroupSetting = _.filter(
      thisGameSetting, (m) => m.gameMethod.indexOf(methodGroup) > -1
    );
    _.forEach(thisGroupSetting, (method) => {
      const nameArray = _.split(method.gameMethod, '-');
      const subGroup = nameArray[2] || '普通';
      gameSubNav[subGroup] = gameSubNav[subGroup] || [];
      if (_.findIndex(gameSubNav[subGroup], (m) => m.methodId === method.methodId) < 0) {
        gameSubNav[subGroup].push(method);
      }
    });
    const firstMethod = gameSubNav[_.keysIn(gameSubNav)[0]][0];
    this.dispatch({
      type: 'betCenter/updateState',
      payload: { gameSubNav }
    });
    this.onMethodSelect(firstMethod);
  }
  setThisGamePrize({ thisGameId, allGamesPrizeSettings }) {
    if (allGamesPrizeSettings[thisGameId]) {
      const { singleGamePrizeSettings } = allGamesPrizeSettings[thisGameId];
      this.dispatch({
        type: 'betCenter/updateState',
        payload: {
          thisGamePrizeSetting: singleGamePrizeSettings,
        }
      });
    }
  }

  setThisMethodSetting({ methodId, thisGamePrizeSetting, thisGameSetting }) {
    const thisMethodSetting = _.find(thisGameSetting, ['methodId', methodId]);
    const thisMethodPrizeSetting = thisGamePrizeSetting[methodId];
    this.dispatch({
      type: 'betCenter/updateState',
      payload: {
        thisMethodSetting,
        thisMethodPrizeSetting
      }
    });
  }
  setCurrentBetInfos({
    methodId, allBetObj, allOpenOptions, betEntries, gameMethod,
    thisMethodSetting
  }) {
    const thisBetObj = allBetObj[methodId] || {};
    const thisOpenOption = allOpenOptions[methodId] || [];
    const { gameRules } = thisMethodSetting;
    let thisBetString = getBetString({ thisBetObj }, gameRules);
    if (thisOpenOption && thisOpenOption.length) {
      const openOptionString = getOpenOptionsString(thisOpenOption);
      thisBetString = `${openOptionString}:${thisBetString}`;
    }
    const repeatEntryIndex = _.findIndex(betEntries, (betEntry) => {
      return betEntry.betString === thisBetString && betEntry.gameMethod === gameMethod;
    }); 
    this.dispatch({
      type: 'betCenter/updateState',
      payload: {
        thisBetObj, thisOpenOption, repeatEntryIndex, thisBetString
      }
    });
  }
  setNumberOfUnits({ thisMethodSetting, thisBetObj, thisOpenOption }) {
    const numberOfUnits = getNumberOfUnits({
      thisMethodSetting, thisBetObj, thisOpenOption
    })
    .validate()
    .calculate()
    .getTotal();
    this.dispatch({ type: 'betCenter/updateState', payload: { numberOfUnits } });
  }
  setCurrentGameInfos({ gameInfosHot, gameInfosRecommend, thisGameId }) {
    const allGameInfos = [...gameInfosHot, ...gameInfosRecommend];
    const thisGameInfo = _.find(allGameInfos, ['gameUniqueId', thisGameId]);
    this.setState({ allGameInfos, thisGameInfo });
  }
  render() {
    const {
      gameInfosHot, gameInfosRecommend, announcements, thisGameId, 
      methodGroup, methodId, gameMethod, allBetObj, allOpenOptions,
      betEntries, userData, lastOpen, awaitingResponse, current, responseMessage,
      responseColor, orderHistory, thisGameSetting, thisMethodPrizeSetting, thisMethodSetting,
      thisBetObj, repeatEntryIndex, numberOfUnits, thisOpenOption, returnMoneyRatio,
      multiply, amountUnit, gameNav, gameSubNav
    } = this.props;
    const { thisGameInfo, } = this.state;
    
    const disabledAddEntry = _.isEmpty(thisBetObj) || !numberOfUnits || repeatEntryIndex > -1;
    const sideNavProps = {
      className: css.betCenter_sidenavBody,
      dispatch: this.props.dispatch,
      gameInfosHot,
      gameInfosRecommend,
      thisGameId,
    };
    const gameHeaderProps = {
      thisGameHistory: lastOpen,
      current,
      thisGameId,
      thisGameInfo,
      onMissingClick: this.onMissingClick,
      onCountDownFinish: this.onCountDownFinish
    };
    const gameNavProps = {
      dispatch: this.dispatch,
      gameNav,
      methodGroup,
      onNavSelect: this.onNavSelect,
      setNav: this.setNav,
      thisGameId,
      thisGameSetting,
    };
    const gameSubNavProps = {
      dispatch: this.dispatch,
      gameMethod,
      gameSubNav,
      methodGroup,
      methodId,
      onMethodSelect: this.onMethodSelect,
      setSubNav: this.setSubNav,
      thisGameId,
      thisGameSetting,
    };
    const gameBoardProps = {
      allBetObj,
      dispatch: this.dispatch,
      gameMethod,
      methodId,
      onBetClick: this.onBetClick,
      onControllerClick: this.onControllerClick,
      thisBetObj,
      thisMethodSetting,
      thisMethodPrizeSetting,
    };
    const gameOpenOptionProps = {
      allOpenOptions,
      dispatch: this.dispatch,
      methodId,
      thisMethodSetting,
      thisOpenOption,
    };
    const gameCalProps = {
      allBetObj,
      allOpenOptions,
      amountUnit,
      betEntries,
      disabledAddEntry,
      dispatch: this.dispatch,
      getAmount: this.getAmount,
      methodId,
      multiply,
      numberOfUnits,
      onAddEntry: this.onAddEntry,
      onInitializeClick: this.onInitializeClick,
      onMultipleChange: this.onMultipleChange,
      onRandomClick: this.onRandomClick,
      onUnitToggle: this.onUnitToggle,
      repeatEntryIndex,
      setTotalUnit: this.setTotalUnit,
      thisBetObj,
      thisGameId,
      thisMethodSetting,
      thisOpenOption,
    };
    const gameCartProps = {
      awaitingResponse,
      betEntries,
      dispatch: this.dispatch,
      onAddEntry: this.onAddEntry,
      onRemoveAll: this.onRemoveAll,
      onEditBetClick: this.onEditBetClick,
      onPostEntryClick: this.onPostEntryClick,
      repeatEntryIndex,
      responseColor,
      responseMessage,
      setInitialResponseState: this.setInitialResponseState,
      thisBetObj,
      thisMethodSetting,
    };
    const returnRatioCtrlProps = {
      userData,
      onRangeChange: this.onReturnRatioChange,
      returnMoneyRatio,
      thisMethodPrizeSetting,
      getAmountPerUnit: this.getAmountPerUnit,
      getEntriesTotal: this.getEntriesTotal,
      awaitingResponse
    };
    const gameHistoryProps = {
      dispatch: this.dispatch,
      orderHistory
    };
    const hasRepeatedBet = repeatEntryIndex > -1;
    const noBetSelected = _.isEmpty(thisBetObj);
    const cartIsEmpty = !betEntries.length;

    if (gameInfosHot) {
      return (
        <div className={css.betCenter}>
          <div className={css.betCenter_sidenav}>
            <div className={css.betCenter_logo}>
              <Link to="/">
                <img
                  className={css.betCenter_logoImg}
                  src={logo}
                  alt={'106CP logo'}
                />
              </Link>
            </div>
            <SideNav {...sideNavProps} />
          </div>
          <div className={css.betCenter_body}>
            <div className={css.betCenter_toptray}>
              <TopTray announcements={announcements} />
            </div>
            <div className={css.betCenter_login}>
              <Login />
            </div>
            <div className={css.betCenter_board}>
              <LoadingBar isLoading={awaitingResponse} style={{ margin: 0 }} />
              <GameHeader {...gameHeaderProps} />
              <GameNav {...gameNavProps} />
              <GameSubNav {...gameSubNavProps} />
              <GameOpenOption {...gameOpenOptionProps} />
              <div className={css.betCenter_boardBody}>
                <div className={css.betCenter_boardColumn}>
                  { thisMethodSetting ? <GameBoard {...gameBoardProps} /> : null }
                  <GameCal {...gameCalProps} />
                  <GameCart {...gameCartProps} />
                </div>
                <div className={css.betCenter_widgetsColumn}>
                  { userData ? <GameHistory {...gameHistoryProps} /> : null}
                  <ReturnRatioCtrl {...returnRatioCtrlProps} />
                  <div className={css.betCenter_actionRow}>
                    <div
                      className={css.betCenter_actionBtns}
                      style={{ backgroundColor: responseColor }}
                    >
                      <button
                        onClick={this.onQuickBetClick}
                        disabled={noBetSelected || hasRepeatedBet || awaitingResponse}
                        data-position="top" className={css.betCenter_actionBtn}
                      >
                        { hasRepeatedBet ? '已有重复' : '立即投注'}
                        </button>
                      <button
                        disabled={cartIsEmpty || awaitingResponse}
                        onClick={this.onPostEntryClick}
                        data-position="bottom"
                        className={css.betCenter_actionBtn}
                      >
                        { cartIsEmpty ? '无投注项' : '确认投注' }
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <UserProfile />          
        </div>
      );
    }
    return (
      <Spin
        size="large" tip="正在加载页面..."
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      />
    );
  }
}

function mapStateToProps({ gameInfosModel, betCenter, userModel, orderModel }) {
  const {
    gameInfosHot, gameInfosRecommend, annoucements, allGamesPrizeSettings
  } = gameInfosModel;
  const { orderHistory } = orderModel;
  const { userData } = userModel;
  return {
    userData,
    orderHistory,
    gameInfosHot,
    gameInfosRecommend,
    annoucements,
    allGamesPrizeSettings,
    ...betCenter
  };
}

export default connect(mapStateToProps)(BetCenterIndex);
