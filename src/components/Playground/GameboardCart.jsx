import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { Row, Column, PageContainer, MDIcon } from '../General/';
import css from '../../styles/playground/gameboard.less';
import { spinDurationTime } from '../../styles/variables.less';
import { addCommas } from '../../utils/';

class GameboardCart extends Component {
  onSelectHandler(gameName) {
    const { onSelectNavOption, onSelectSingleGame, navOptions } = this.props;
    const targetList = _.split(gameName, '-');
    const navTarget = targetList[0];
    if (onSelectNavOption && onSelectSingleGame) {
      onSelectNavOption(navTarget, navOptions[navTarget]);
      onSelectSingleGame(gameName);
    }
  }
  onConfirmClick() {
    const { dispatch } = this.props;
    const timeout = Number(spinDurationTime) * 1000;
    dispatch({ type: 'playgroundModel/putSubmissionToLoading' });
    setTimeout(() => {
      dispatch({
        type: 'playgroundModel/submitCart',
      });
    }, timeout);
  }
  onClearCartHandler() {
    const { dispatch } = this.props;    
    dispatch({ type: 'playgroundModel/clearCart' });
  }
  onRemoveItemHandler(index) {
    const { dispatch } = this.props;
    dispatch({ type: 'playgroundModel/removeCartItem', payload: index });
  }
  renderSinglePick(section) {
    return (
      <span>
        {
          _.map(section, (pick) => {
            return <span key={pick} className={css.gameboard_cartSinglePick}>{pick} </span>;
          })
        }
      </span>
    );
  }
  renderScene() {
    const { cart, selectedGameName } = this.props;
    return (
      <div>
        {
          _.map(cart, (cartItem, index) => {
            const {
              gameName,
              largestPrizeAmount,
              joinSectionWith,
              order,
              displayString
            } = cartItem;
            const { amount, pricePerUnit, numberOfUnits, returnMoneyRatio } = order; 
            const displayStringArray = _.split(displayString, joinSectionWith);
            const rowClass = selectedGameName === gameName ? 
              css.gameboard_cartGameRow__active :
              css.gameboard_cartGameRow;
            return (
              <div className={css.gameboard_cartBody} key={`${gameName}${index}`}>
                <Row className={rowClass}>
                  <Column width="10%" className={css.gameboard_cartColumn} float="none">
                    <a onClick={this.onSelectHandler.bind(this, gameName)}>
                      { gameName }
                    </a>
                  </Column>
                  <Column width="40%" className={css.gameboard_cartPicksColumn} float="none">
                    { displayStringArray.length &&
                      _.map(displayStringArray, (section, i) => {
                          return (
                            <p key={i} className={css.gameboard_cartSectionRow}>
                              { section }
                            </p>
                          );
                      })
                    }
                  </Column>
                  <Column className={css.gameboard_cartColumn} float="none">
                    <span>
                      { addCommas(pricePerUnit) }元
                    </span>
                  </Column>
                  <Column width="5%" className={css.gameboard_cartColumn} float="none">
                    <span>{ numberOfUnits }</span>
                  </Column>
                  <Column width="8%" className={css.gameboard_cartColumn} float="none">
                    <span>{ addCommas(amount) }元</span>
                  </Column>
                  <Column width="5%" className={css.gameboard_cartColumn} float="none">
                  { returnMoneyRatio > 0 ?
                    <span>{ (returnMoneyRatio * 100).toFixed(0) }%</span>
                    : <span> - </span>
                  }
                  </Column>
                  <Column width="15%" className={css.gameboard_cartColumn} float="none">
                    <span>
                      { _.isNumber(largestPrizeAmount) ? `${addCommas(largestPrizeAmount)}元` : '-' }
                    </span>
                  </Column>
                  <Column width="7%" className={css.gameboard_cartColumn} float="none">
                  <button onClick={this.onRemoveItemHandler.bind(this, index)}>
                    <MDIcon
                      className={css.gameboard_cartRemoveIcon}
                      iconName="close-circle"
                    />
                  </button>
                  </Column>
                </Row>
              </div>
            );
          })
        }
      </div>
    );
  }
  render() {
    const {
      cart,
      submissionIsLoading,
      submissionSuccess,
      GameboardDoneLoading,
      submitButtonText,
      submitButtonIcon,
      submitButtonClass
    } = this.props;
    if (GameboardDoneLoading) {
      return (
        <PageContainer className={css.gameboard_cart}>
          <Row className={css.gamebaord_cartConfirm}>
            <button
              disabled={submissionIsLoading || submissionSuccess}
              onClick={this.onConfirmClick.bind(this)}
              className={css[submitButtonClass]}
            >
              <span className={css.gamebaord_cartConfirmBtnContent}>
                <MDIcon
                  bubbleCount={cart.length || 0}
                  className={css.gameboard_cartConfirmIcon}
                  iconName={submitButtonIcon}
                />
                <span>{ submitButtonText }</span>
              </span>
            </button>
          </Row>
          { !_.isEmpty(cart) &&
            <div>
              <Row className={css.gameboard_cartHeader}>
                <Column width="10%" className={css.gameboard_cartColumn}>游戏</Column>
                <Column width="40%" className={css.gameboard_cartColumn}>选号</Column>
                <Column width="10%" className={css.gameboard_cartColumn}>单注金额</Column>
                <Column width="5%" className={css.gameboard_cartColumn}>注数</Column>
                <Column width="8%" className={css.gameboard_cartColumn}>总下注金额</Column>
                <Column width="5%" className={css.gameboard_cartColumn}>返利 %</Column>
                <Column width="15%" className={css.gameboard_cartColumn}>最高中奖金额</Column>
                <Column width="7%" className={css.gameboard_cartColumn}>
                  <button onClick={this.onClearCartHandler.bind(this)}>
                    全清
                    <MDIcon
                      className={css.gameboard_cartClearAllIcon}
                      iconName="notification-clear-all"
                    />
                  </button>
                </Column>
              </Row>
              <Row>
                { this.renderScene() }
              </Row>
            </div>
          }
        </PageContainer>
      );
    }
    return null;
  }
}

const mapStatesToProps = ({ playgroundModel }) => {
  const {
    cart,
    existingPicks,
    GameboardDoneLoading,
    navOptions,
    selectedGameName,
    selectedGameSetting,
    submissionIsLoading,
    submissionSuccess,
    submitButotnColor,
    submitButtonClass,
    submitButtonIcon,
    submitButtonText,
  } = playgroundModel;
  return {
    cart,
    existingPicks,
    GameboardDoneLoading,
    navOptions,
    selectedGameName,
    selectedGameSetting,
    submissionIsLoading,
    submissionSuccess,
    submitButotnColor,
    submitButtonClass,
    submitButtonIcon,
    submitButtonText,
  };
};

export default connect(mapStatesToProps)(GameboardCart);
