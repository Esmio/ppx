import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { Row, Column, MDIcon } from '../General/';
import css from '../../styles/playground/gameboard.less';
import { type, addCommas } from '../../utils/';

class GameboardCalculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numberOfUnits: null,
      currentBetUnit: '元',
      gameIsPristine: true
    };
  }
  componentWillMount() {
    this.validatePristine(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.validatePristine(nextProps);     
  }
  onInitialClickHandler() {
    const { dispatch, selectedGameName } = this.props;
    dispatch({ type: 'playgroundModel/initializeGame', payload: selectedGameName });
    this.setState({ currentBetUnit: '元' });
  }
  onMultiplyClickHandler() {
    const { dispatch } = this.props;
    dispatch({ type: 'playgroundModel/addMultiply' });
  }
  onRangeDragHandler(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'playgroundModel/addReturnRatio',
      payload: value
    });
  }
  onConfirmClickHandler() {
    const { dispatch, selectedGameName } = this.props;
    dispatch({ type: 'playgroundModel/addItemToCart' });
    dispatch({ type: 'playgroundModel/initializeGame', payload: selectedGameName });
    dispatch({ type: 'playgroundModel/putSubmissionToReady' });
    this.onInitialClickHandler();
  }
  onRandomPickHandler() {
    const { dispatch } = this.props;
    dispatch({ type: 'playgroundModel/addRandomPicks' });
  }
  setBetUnit() {
    const { currentBetUnit } = this.state;
    const units = _.keys(type.UNITS);
    let unitIndex = _.indexOf(units, currentBetUnit);
    unitIndex++;
    unitIndex = unitIndex >= units.length ? 0 : unitIndex;
    const unitName = units[unitIndex];
    this.setState({ currentBetUnit: unitName });
  }
  validatePristine({
    selectedGameName,
    existingPicks,
    existingBetAmount,
    existingMultiply,
    existingReturnRatio
  }) {
    const currentGamePicks = existingPicks[selectedGameName] || {};
    const currentBetQuantity = existingBetAmount[selectedGameName] || type.initialBetAmount;
    const currentMultiply = existingMultiply[selectedGameName] || 1;
    const currentReturnRatio = existingReturnRatio[selectedGameName] || 0;
    const gameIsPristine = 
      _.isEmpty(currentGamePicks) && 
      _.isEqual(currentBetQuantity, { ...type.initialBetAmount }) &&
      currentMultiply === 1 &&
      currentReturnRatio === 0;
      // console.debug(currentGamePicks);

    this.setState({ gameIsPristine });
  }
  amountOnChange(amount) {
    const { dispatch } = this.props;
    const { currentBetUnit } = this.state;
    dispatch({
      type: 'playgroundModel/addBetAmount',
      payload: {
        unit: currentBetUnit, amount: amount < 0 ? 0 : amount > 500 ? 500 : amount
      }
    });
    dispatch({ type: 'playgroundModel/calculateBet ' });
  }
  amountToggleHandler(controller) {
    const { existingBetAmount, selectedGameName } = this.props;
    const { currentBetUnit } = this.state;
    const currentAmount = existingBetAmount[selectedGameName][currentBetUnit];
    if (controller === '+') {
      this.amountOnChange.call(this, currentAmount + 1);
    } else if (controller === '-') {
      this.amountOnChange.call(this, currentAmount - 1);
    }
  }
  render() {
    const { 
      numberOfUnits, 
      existingBetAmount,
      existingMultiply,
      existingReturnRatio,
      largestPrizeAmount,
      gamePrize,
      selectedGameName,
      pricePerUnit
    } = this.props;
    const { currentBetUnit, gameIsPristine } = this.state;
    const { ratioOfReturnAmount, prizeSettings } = gamePrize;
    const btnShouldPush = numberOfUnits >= 1;
    const calAmount = existingBetAmount[selectedGameName][currentBetUnit];
    const currentMultiply = existingMultiply[selectedGameName];
    const currentReturnRatio = existingReturnRatio[selectedGameName] || 0;
    const prizeAmount = prizeSettings[0].prizeAmount;
    const firstPrizeName = prizeSettings[0].prizeNameForDisplay;
    const shouldShowPrize = firstPrizeName === type.GRAND_PRIZE && prizeAmount;
    // console.debug(gamePrize);
    const quantityLabelClass = numberOfUnits >= 1 ?
      css.gameboard_calQuantityLabel__hasValue :
      css.gameboard_calQuantityLabel;
    return (
      <Row className={css.gameboard_calRow}>
        <Column>
          <div className={css.gameboard_calAmountControls}>
            <span className={css.gameboard_calAmountInputlabel}>
              投注
            </span>
            <input
              type="number"
              className={css.gameboard_calAmountInput}
              value={calAmount}
              onChange={event => this.amountOnChange(event.target.value)}
            />
            <span className={css.gameboard_calAddMinus}>
              <button
                onClick={this.amountToggleHandler.bind(this, '+')}
                className={css.gameboard_calAddMinusBtn}
              >
                <MDIcon
                  className={css.gameboard_calToggleIcon}
                  iconName="menu-up"
                />
              </button>
              <button
                onClick={this.amountToggleHandler.bind(this, '-')}
                className={css.gameboard_calAddMinusBtn}
              >
                <MDIcon
                  className={css.gameboard_calToggleIcon}
                  iconName="menu-down"
                />
              </button>
            </span>
            <button
              className={css.gameboard_calUnitBtn}
              onClick={this.setBetUnit.bind(this)}
            >
              { currentBetUnit }
            </button>
          </div>
          <div className={css.gameboard_calReturnRatio}>
            <span className={css.gameboard_calReturnLabel}>返利</span>
            <div className={css.gameboard_calRange}>
              <input
                className={css.gameboard_rangeInput}
                max={ratioOfReturnAmount}
                min="0"
                step={ratioOfReturnAmount / 20}
                type="range"
                data-hasValue={currentReturnRatio > 0}
                value={currentReturnRatio}
                onChange={event => this.onRangeDragHandler(event.target.value)}
                onDrag={event => this.onRangeDragHandler(event.target.value)}
              />
              <div
                className={css.inputHighlight}
                style={{ width: `${(currentReturnRatio / ratioOfReturnAmount) * 100}%` }}
              />
            </div>
            <span
              className={css.gameboard_calReturnLabel}
            >{ (currentReturnRatio * 100).toFixed(0) }%</span>
          </div>
          <span className={quantityLabelClass}>{ numberOfUnits } 注</span>   
          <span className={css.gameboard_calAmountLabel}>
            单注金额: { addCommas(numberOfUnits > 0 ? pricePerUnit : 0) }元
          </span>
          {
            shouldShowPrize &&
            <span>
              <span className={css.gameboard_calFormulaLabel}>x</span>       
              <span className={css.gameboard_calPrizeLabel}>赔率 { prizeAmount }</span>
              <span className={css.gameboard_calFormulaLabel}>=</span>
              <span className={css.gameboard_calAmountLabel}>
                奖金最高达 { addCommas(largestPrizeAmount) } 元
              </span>
            </span>
          }
        </Column>
        <Column float="right">
          <button
            onClick={this.onInitialClickHandler.bind(this)}
            className={
              gameIsPristine ?
              css.gameboard_clearBtn__hide :
              btnShouldPush ?
              css.gameboard_clearBtn__pushed : 
              css.gameboard_clearBtn
            }
            disabled={gameIsPristine}
          >
            <MDIcon iconName="undo-variant" />
            <span className={css.gameboard_calBtnsText}>清空</span>
          </button>
          <button
            onClick={this.onRandomPickHandler.bind(this)}
            className={
              btnShouldPush ?
              css.gameboard_randomBtn__pushed : 
              css.gameboard_randomBtn
            }
          >
            <MDIcon iconName="robot" /><span className={css.gameboard_calBtnsText}>机选</span>
          </button>
          <button
            onClick={this.onMultiplyClickHandler.bind(this)}
            className={
              btnShouldPush ?
              css.gameboard_multiplyBtn__pushed : 
              css.gameboard_multiplyBtn
            }
          >
            <MDIcon iconName="arrow-up-bold-hexagon-outline" />
            <span className={css.gameboard_calBtnsText}>
              加倍
            </span>
            <span className={css.gameboard_calCountBubble}>{currentMultiply}</span>
          </button>
          <button
            onClick={this.onConfirmClickHandler.bind(this)}
            className={
              btnShouldPush ?
              css.gameboard_addBtn__pushed : 
              css.gameboard_addBtn
            }
            disabled={numberOfUnits < 1}
          >
            <MDIcon iconName="cart-plus" />
            <span className={css.gameboard_calBtnsText}>添加</span>
          </button>
        </Column>
      </Row>
    );
  }
}

const mapStatesToProps = ({ playgroundModel }) => {
  const {
    amount,
    existingBetAmount,
    existingMultiply,
    existingOpenOptions,
    existingPicks,
    existingPrizeAmount,
    existingReturnRatio,
    GameboardDoneLoading,
    gamePrize,
    largestPrizeAmount,
    numberOfUnits,
    pricePerUnit,
    selectedGameName,
    selectedGameSetting,
  } = playgroundModel;
  return {
    amount,
    existingBetAmount,
    existingMultiply,
    existingOpenOptions,
    existingPicks,
    existingPrizeAmount,
    existingReturnRatio,
    GameboardDoneLoading,
    gamePrize,
    largestPrizeAmount,
    numberOfUnits,
    pricePerUnit,
    selectedGameName,
    selectedGameSetting,
  };
};

export default connect(mapStatesToProps)(GameboardCalculator);
