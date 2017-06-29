import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MDIcon } from '../General';
import CountDownTimer from './CountDownTimer/';
import LastOpenResult from './LastOpenResult';
import css from './styles/GameHeader.less';

class GameHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeRemaining: 0,
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setTimer(nextProps);
  }
  setTimer({ current }) {
    const { stopOrderTimeEpoch } = current;
    if (stopOrderTimeEpoch) {
      let timeRemaining = (stopOrderTimeEpoch * 1000) - +Date.now();
      timeRemaining = Math.round(timeRemaining);
      this.setState({ timeRemaining });
    }
  }
  render() {
    const { thisGameInfo, thisGameHistory, onCountDownFinish, onMissingClick } = this.props;
    
    const { timeRemaining } = this.state;
    if (thisGameInfo && thisGameHistory) {
      const { gameNameInChinese, gameIconUrl } = thisGameInfo;
      const { openCode, uniqueIssueNumber, openStatus } = thisGameHistory;
      const lastOpenProps = {
        uniqueIssueNumber,
        lastOpenResult: openCode,
        openStatus
      };
      const countDownProps = {
        initialTimeRemaining: timeRemaining,
        completeCallback: onCountDownFinish
      };
      return (
        <div className={css.gameHeader}>
          <div className={css.gameHeader_infosRow}>
            <div className={css.gameHeader_infos}>
              <img
                className={css.gameIcon} src={gameIconUrl} alt={gameNameInChinese}
              />
              <div className={css.gameHeader_infosContent}>
                <p className={css.headerGameName}>{gameNameInChinese}</p>
                <p>
                  第 <strong>{ uniqueIssueNumber }</strong> 期
                </p>
                <div className={css.headerLinks}>
                  <button className={css.headerLink} onClick={onMissingClick}>
                    <MDIcon iconName="clipboard-text" />遗漏分析
                  </button>
                  <button className={css.headerLink}>
                    <MDIcon iconName="history" />历史开奖
                  </button>
                </div>
              </div>
            </div>
            <div className={css.gameHeader__LastOpenResult}>
              <LastOpenResult {...lastOpenProps} />
            </div>
            <div className={css.gameHeader_timer}>
              <p>剩余投注时间</p>
              <CountDownTimer {...countDownProps} />
            </div>
          </div>
        </div>
      );
    } return null;
  }
}

GameHeader.propTypes = {
  thisGameId: PropTypes.string,
  thisGameInfo: PropTypes.object,
  thisGameHistory: PropTypes.object
};

export default GameHeader;
