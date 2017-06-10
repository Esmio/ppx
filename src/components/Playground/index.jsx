import React, { Component } from 'react';
import { notification } from 'antd';
import _ from 'lodash';
import { Link } from 'dva/router';
import { connect } from 'dva';
import Gameboard from './Gameboard';
import CountdownRadial from './CountdownRadial';
import CountdownNumber from './CountdownNumber';
import SideNav from '../Header/SideNav';
import TopTray from '../Header/TopTray';
import Login from '../Header/Login';
import { Row, Image, MDIcon, EllipsisLoader } from '../General/';
import css from '../../styles/playground/playgroundIndex.less';
import lessVar from '../../styles/variables.less';
import logo from '../../assets/image/logo.png';

class PlaygroundIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameDuration: null,
      openDuration: null
    };
    this.getResultInterval = null;
    this.refreshGameInfo = this.refreshGameInfo.bind(this);
    this.getRefreshInterval = this.getRefreshInterval.bind(this);
    this.getCountdownDuration = this.getCountdownDuration.bind(this);
  }
  componentWillMount() {
    if (this.props.selectedLotResult) {
      this.getCountdownDuration(this.props.selectedLotResult);
      this.getRefreshInterval(this.props.selectedLotResult);
    }
  }
  componentWillReceiveProps(nextProps) {
    clearInterval(this.getResultInterval);    
    if (nextProps.selectedLotResult) {
      this.getCountdownDuration(nextProps.selectedLotResult);    
      this.getRefreshInterval(nextProps.selectedLotResult);
    }
  }
  componentWillUnmount() {
    clearInterval(this.getResultInterval);
  }
  getCountdownDuration({ current }) {
    const currentTime = new Date();
    if (current.stopOrderTime) {
      const gameEndTime = new Date(current.stopOrderTime);
      const durationMilliSec = +gameEndTime - +currentTime;
      const gameDuration = Math.round(durationMilliSec / 1000);
      this.setState({ gameDuration });
    }
  }
  getRefreshInterval({ lastOpen }) {
    const currentTime = new Date();
    const openTime = new Date(lastOpen.officialOpenTime);
    const openDuration = +openTime - +currentTime;
    const refreshTime = 15000;
    this.setState({
      openDuration: openDuration < refreshTime ? refreshTime : openDuration
    });
    if (openDuration > 0) {
      this.getResultInterval = setInterval(this.refreshGameInfo, openDuration);
    } else if (openDuration < 0 && !lastOpen.openStatus) { 
      this.getResultInterval = setInterval(this.refreshGameInfo, refreshTime);
    }
  }
  refreshGameInfo(shouldInitialize) {
    const {
      selectedLotUniqueId,
      dispatch
    } = this.props;
    dispatch({
      type: 'playgroundModel/getSelectedLotResults',
      payload: {
        lotUniqueId: selectedLotUniqueId,
        shouldInitialize
      }
    });
    notification.close('refreshNotification');
  }
  countDownCompleteHandler() {
    const key = 'refreshNotification';
    const btn = (
      <button
        className={css.playground_notificationBtn}
        onClick={this.refreshGameInfo(true)}
      >
        <MDIcon iconName="refresh" /><span>刷新重新下注</span>
      </button>
    );
    notification.config({
      placement: 'bottomRight'
    });
    notification.open({
      duration: 9,
      message: '购彩时间已经截止',
      description: '请问是否想刷新之前所投下的注数',
      btn,
      key,
      onClose: this.refreshGameInfo(false),
    });
  }
  renderOpenedNumbers({ openCode, uniqueIssueNumber }) {
    const numbers = _.split(openCode, ',');
    const animationDuration = 0.2;
    return (
      <div>
        <p className={css.playground_headerPhase}>
          第 <strong>{ uniqueIssueNumber }</strong> 期开奖号码
        </p>
        <p className={css.playground_openNumbers}>
          { openCode &&
            numbers.map((number, index) => {
              const animation = {
                animationDuration: `${animationDuration}s`,
                animationDelay: `${(animationDuration / 2) * index}s`,
              };
              return (
                <span
                  style={animation}
                  className={css.playground_openNumber}
                  key={number + index}
                >
                  { number }
                </span>
              );
            }) 
          }
        </p>
      </div>
    );
  }
  renderCurrentGameInfo(gameInfo, currentPlayInfo) {
    const { gameIconUrl, gameNameInChinese, gameDescription } = gameInfo;
    const { uniqueIssueNumber } = currentPlayInfo;
    // console.log(currentPlayInfo);
    const { gameDuration } = this.state;
    return (
      <Row>
        <div className={css.playground_headerThumb}>
          { gameDuration &&
            <CountdownRadial
              duration={gameDuration}
            />
          }
          <Image
            borderRadius="50%"
            className={css.playground_headerThumbImg}
            height={lessVar.size9}
            width={lessVar.size9}
            imgUrl={gameIconUrl}
            imgAlt={`${gameNameInChinese} ${gameDescription}`}
          />
        </div>
        <div className={css.playground_headerInfos}>
          <p className={css.playground_headerGameName}>{gameNameInChinese}</p>
          <p className={css.playground_headerPhase}>
            第 <strong>{ uniqueIssueNumber }</strong> 期
          </p>
          <p>將在
            { gameDuration && 
              <CountdownNumber
                duration={gameDuration}
                onFinised={this.countDownCompleteHandler.bind(this)}
              />
            }
            截止
          </p>
        </div>
      </Row>
    );
  }
  renderHeaderHistory(lastOpen) {
    const { uniqueIssueNumber } = lastOpen;
    const { openDuration } = this.state;
    if (lastOpen.openStatus) {
      return (
        <div className={css.playground_gameResult}>
          { lastOpen && lastOpen.openStatus && this.renderOpenedNumbers(lastOpen) }
        </div>
      );
    }
    return (
      <div className={css.playground_gameResult}>
        <div>
          <p className={css.playground_headerPhase__grayOut}>
            正等待第<strong>{ uniqueIssueNumber }</strong>
            期开奖数据 <EllipsisLoader duration={openDuration} />
          </p>
        </div>
      </div>
    );
  }
  renderHeader(gameInfo, { current, lastOpen }) {
    return (
      <Row className={css.playground_header}>
        <div className={css.playground_headerGameInfos}>
          { current && this.renderCurrentGameInfo(gameInfo, current) }
        </div>
        { lastOpen && this.renderHeaderHistory(lastOpen) }
      </Row>
    );
  }
  render() {
    const {
      selectedLotSettings,
      selectedLotInfos,
      selectedLotResult
    } = this.props;
    
    return (
      <Row className={css.playground}>
        <div className={css.playground_sidenav}>
          <Row className={css.playground_logo}>
            <Link to="/">
              <img
                className={css.playground_logoImg}
                src={logo}
                alt={'106CP logo'}
              />
            </Link>
          </Row>
          <SideNav className={css.playground_sidenavBody} />
        </div>
        <div className={css.playground_body}>
          <TopTray />
          <Login className={css.playground_login} />
          <div className={css.playboard} ref="playboard">
            {
              selectedLotInfos &&
              selectedLotResult &&
              this.renderHeader(selectedLotInfos, selectedLotResult)
            }  
            <Row className={css.playground_gameboard}>
              { 
                selectedLotSettings && <Gameboard />
              }
            </Row>
          </div>
        </div>
      </Row>
    );
  }
}

const mapStatesToProps = ({ playgroundModel }) => {
  const {
    cart,
    existingPicks,
    selectedLotInfos,
    selectedLotResult,
    selectedLotSettings,
    selectedLotUniqueId,
  } = playgroundModel;
  return {
    cart,
    existingPicks,
    selectedLotInfos,
    selectedLotResult,
    selectedLotSettings,
    selectedLotUniqueId,
  };
};

export default connect(mapStatesToProps)(PlaygroundIndex);
