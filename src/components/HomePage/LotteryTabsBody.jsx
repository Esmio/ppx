import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import css from '../../styles/homepage/lotteryTabs.less';
import { addCommas } from '../../utils';
import { Row, Column, Loader } from '../General/';
import {settingMap} from '../../utils';

let {gamesMap} = settingMap;
let ballDict = {
  'SSC' : {ballArray: getBallArray(9), group: false, openLength: 5},
  'BJPK10' : {ballArray : getBallArray(10, 1), group: true, openLength: 10},
  'SSL' : {ballArray: getBallArray(9), group: false, openLength: 5},
  'KL10F' : {ballArray: getBallArray(20), group: true, openLength: 5},
  'D11X5' : {ballArray: getBallArray(11, 1, true), group: true, openLength: 5, order: true},
  'D3' : {ballArray: getBallArray(9), group: false, openLength: 3},
  'MarkSix' : {ballArray: getBallArray(49, 1, true), group: true, openLength: 7, order: true},
  'HF28' : {ballArray: getBallArray(9), group: false, openLength: 3},
  'PL' : {ballArray: getBallArray(9), group: false, openLength: 3},
  'K3' : {ballArray: getBallArray(6, 1), group: false, openLength: 3}
}

function getBallArray(max, min, digit){
  let arr = [];
  min = min || 0;
  for(let i = min; i <= max; i++){
    i = digit && i < 10 ? '0' + i : i;
    i += '';
    arr.push(i);
  }
  return arr;
}

function getRandomBalls(balls, openCodeLength, group){
  let ballArr = [], ballArr2 = balls.slice()
  for (var i = 0; i < openCodeLength; i++) {
    let randomIndex = getRandomIndex(ballArr2.length)
    ballArr[i] = ballArr2[randomIndex]
    if(group) ballArr2.splice(randomIndex, 1)
  }
  return ballArr
}
// 冒泡排序
function bubbling(arr){
  let length = arr.length
  for(let i = length-1; i >= 0 ; i--) {
    for(let j = 0; j < i; j++) {
      let num = arr[j]
      if(parseInt(arr[j]) > parseInt(arr[j+1])) {
        arr[j] = arr[j+1]
        arr[j+1] = num
      }
    }
  }
  return arr
}

function getRandomIndex(length){
  return Math.floor(Math.random()*length)
}

function LotteryTabsBody(
{
  tabContent,
}
) {
  function renderLotBalls() {
    let {gameUniqueId} = tabContent;
    let {gameSettingsMap} = gamesMap[gameUniqueId];
    let {ballArray, group, openLength, order} = ballDict[gameSettingsMap];
    let randomBalls = getRandomBalls(ballArray, openLength, group)
    if(order) randomBalls = bubbling(randomBalls)
    return (
      <Column width="70%">
        {
          randomBalls.map((number, index) => {
            return (
              <span
                className={css.lotteryTab_contentsNumber}
                key={`${number}${index}`}
              >{ number }
              </span>
            )
          })
        }
      </Column>
    );
  }
  function getDuration(time) {
    const currentTime = moment(new Date());
    const lotteryOpeningTime = moment(time);
    const timeDifferences = currentTime.diff(lotteryOpeningTime);
    return moment.duration(timeDifferences).humanize(true);
  }
  function renderScene() {
    if (tabContent) {
      const {
        uniqueIssueNumber, openTime, gameIconUrl
      } = tabContent;
      const lotteryDuration = getDuration(openTime);
      const backgroundImage = `url('${gameIconUrl}')`;
      return (
        <Row className={css.lotteryTab_contents}>
          <Row className={css.lotteryTab_contentsRow}>
            <Column>
              <div
                className={css.lotteryTab_contentsThumbnail}
                style={{ backgroundImage }}
              />
            </Column>
            <Column width="50%" className={css.lotteryTab_contentsInfo}>
              <p className={css.lotteryTab_contentsText}>第 {addCommas(uniqueIssueNumber)} 期</p>
              <p className={css.lotteryTab_contentsText}>{lotteryDuration}截止</p>
            </Column>
            <Column width="30%" className={css.lotteryTab_contentsBtns__withIcon}>
              <button className={css.lotteryTab_contentsBtn__checkBox}>手动选号</button>
              <button className={css.lotteryTab_contentsBtn__chart}>走势图</button>
            </Column>
          </Row>
          <Row className={css.lotteryTab_contentsRow}>
            <div className={css.lotteryTab_contentsNumbers}>
              <Row>
                { tabContent && renderLotBalls() }
                <Column width="30%" className={css.lotteryTab_contentsBtns__buyIn}>
                  <button className={css.lotteryTab_contentsBtn__buyIn}>立即下注</button>
                </Column>
              </Row>
            </div>
          </Row>
          <Row />
        </Row>
      );
    }

    return <Loader />;
  }

  return (
    <div>
      {renderScene()}
    </div>
  );
}

export default LotteryTabsBody;
