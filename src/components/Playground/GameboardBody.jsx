import React, { Component } from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import _ from 'lodash';
import { getPrizeAmount } from '../../utils/';
import { gameRules } from '../../services';
import { Row, Column, MDIcon, Loader, PageContainer } from '../General/';
import GameboardBtns from './GameboardBtns';
import GamboardControllerBtns from './GamboardControllerBtns';
import GameboardCalculator from './GameboardCalculator';
import lessVar from '../../styles/variables.less';
import css from '../../styles/playground/gameboard.less';

class GameboardBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      controllerColumnWidth: 0
    };
  }
  componentDidMount() {
    const controllerDOM = this.refs.controller;
    if (controllerDOM && this.state.controllerColumnWidth !== controllerDOM.offsetWidth) {
      this.setState({
        controllerColumnWidth: controllerDOM.offsetWidth
      });
    }
    // console.debug(this.refs.controller.offsetWidth);
  }
  openOptionsHandler({ gameName, value }) {
    const { dispatch } = this.props;
    dispatch({
      type: 'playgroundModel/addOpenOptions',
      payload: { gameName, value }
    });
  }
  singlePickHandler({ gameName, sections, sectionName, value }) {
    const { dispatch } = this.props;
    dispatch({
      type: 'playgroundModel/addExistingPicks',
      payload: { gameName, sections, sectionName, value }
    });
  }
  renderGroupBtnSets({
    numbers, existingPicks, gameName, sectionName, prizeSettings
  }) {
    if (numbers) {
      return (
        <div>
          {
            _.map(numbers, (nums, groupName) => {
              const groupLabel = _.split(groupName, '-');
              const labelName = groupLabel[0];
              const labelColor = groupLabel[1];
              const valueIsExist = gameRules.isValueExist(
                { existingPicks, gameName, sectionName, value: labelName }
              );
              const prizeAmount = getPrizeAmount({ prizeName: labelName, prizeSettings });
              const btnActiveStyle = {
                color: 'white',
                backgroundColor: `#${labelColor}`
              };
              const btnInactiveStyle = {
                color: `#${labelColor}`
              };
              const labelActiveStyle = {
                color: lessVar.lightOrange,
                backgroundColor: lessVar.playgroundGray
              };
              const labelInactiveStyle = { 
                color: 'white',
                backgroundColor: `#${labelColor}`
              };
              const btnStyle = valueIsExist ? btnActiveStyle : btnInactiveStyle;
              const labelStyle = valueIsExist ? labelActiveStyle : labelInactiveStyle;
              return (
                <a
                  key={labelName}
                  style={labelColor ? btnStyle : {}}
                  className={
                    classnames(css.gameboard_btnsGroup, prizeAmount ? css.hasBtnAmount : '')
                  }
                  onClick={this.singlePickHandler.bind(this,
                    { gameName, sectionName, value: labelName }
                  )}
                >
                  <Column className={css.gameboard_btnsLabel}>
                    <p className={css.gameboard_btnsLabelParagraph}>
                      <span
                        style={labelColor ? labelStyle : {}}
                        className={css.gameboard_btnsLabelSpan}
                      >
                        { labelName }
                      </span>
                    </p>
                  </Column>
                  { nums &&
                    <GameboardBtns
                      prizeSettings={prizeSettings}
                      isValueExist={value => gameRules.isValueExist({
                        existingPicks, gameName, sectionName, value
                      })}
                      btnsCollection={nums}
                      groupLabel={labelName}
                    />
                  }
                  <span className={css.gameboard_bodyBtnAmount}>
                    { prizeAmount }
                  </span>
                </a>
              );
            })
          }
        </div>
      );
    }
    return null;
  }
  renderBtnSets({ gameName, sectionName, numbers, prizeSettings }) {    
    const itemInNumbers = numbers[_.keys(numbers)[0]];
    const { existingPicks } = this.props;
    if (_.isArray(itemInNumbers)) {
      return this.renderGroupBtnSets({
        existingPicks, gameName, sectionName, prizeSettings, numbers
      });
    }
    return (
      <Row>
        <GameboardBtns
          prizeSettings={prizeSettings}
          isValueExist={value => gameRules.isValueExist({
            existingPicks, gameName, sectionName, value
          })}
          btnsCollection={numbers}
          onSinglePick={value => this.singlePickHandler({ gameName, sectionName, value })}
        />
      </Row>
    );
  }
  renderGameboard(selectedGameSetting, gamePrize) {
    const { gameSetCombination } = selectedGameSetting;
    const { prizeSettings } = gamePrize;
    const { sections, set, selectedGameName, alternateSet } = gameSetCombination;
    const marginRight = {
      marginRight: this.state.controllerColumnWidth
    };
    // console.debug('gameSetCombination', gameSetCombination);
    // console.debug('prizeSetting', prizeSettings);
    return (
      <div className={css.gameboard_bodyBtnGroup}>
        { sections &&
          _.map(sections, (sectionName, index) => {
            const useAlternate = index >= 1 && alternateSet;
            const numbers = useAlternate ? alternateSet : set;
            return (
              <Row className={css.gamboard_btnsRow} key={sectionName}>
                <Column className={css.gameboard_btnsLabel}>
                  <p className={css.gameboard_btnsLabelParagraph}>
                    <span className={css.gameboard_btnsLabelSpan}>
                      { sectionName }
                      {
                        gameRules.onlyShowOneAmount(prizeSettings) &&
                        <span className={css.gameboard_labelAmount}>
                          { gameRules.getTheOnlyAmountOf(prizeSettings) }
                        </span>
                      }
                    </span>
                  </p>
                </Column>
                <Column className={css.gameboard_btnColumn} style={marginRight}>
                  { 
                    this.renderBtnSets({
                      gameName: selectedGameName,
                      sectionName,
                      numbers,
                      prizeSettings:
                        gameRules.onlyShowOneAmount(prizeSettings) ? 
                        null : prizeSettings
                    })
                  }
                </Column>
                <div
                  className={css.gamboard_controllerBtnsColumn}
                  ref="controller"
                >
                  <GamboardControllerBtns
                    numbers={numbers}
                    sectionName={sectionName}
                    onSelect={value => {
                      this.singlePickHandler({
                        gameName: selectedGameName,
                        sections,
                        sectionName,
                        value
                      });
                    }}
                  />
                </div>
              </Row>
            );
          })
        }
      </div>
    );
  }
  renderScene() {
    const { selectedGameSetting, gamePrize, existingOpenOptions } = this.props;
    const { gameSetCombination } = selectedGameSetting;
    const { selectedGameName } = gameSetCombination;
    const openOptionsOptions = selectedGameSetting.gameSetCombination.openOptions;
    return (
      <div>
        {
          _.isArray(openOptionsOptions) &&
          <Row className={css.gameboard_btnsOpenOptions}>
            {
              _.map(openOptionsOptions, (pick, index) => {
                const btnIsActive = 
                  existingOpenOptions[selectedGameName] &&
                  existingOpenOptions[selectedGameName].indexOf(index) >= 0;
                const openOptionsClass = btnIsActive ?
                  css.gameboard_btnOpenOptions__active : css.gameboard_btnOpenOptions;
                return (
                  <button
                    key={pick}
                    className={openOptionsClass}
                    onClick={this.openOptionsHandler.bind(this, {
                      gameName: selectedGameName, value: index, 
                    })}
                  >
                    <MDIcon
                      className={css.gameboard_iconOpenOptions}
                      type="checkbox"
                      iconName="check" 
                    /> { pick }
                  </button>
                );
              })
            }
          </Row>
        }
        <Row className={css.gameboard_body}>
          <Column>
            {
              this.renderGameboard(selectedGameSetting, gamePrize)
            }
          </Column>
        </Row>
      </div>
    );
  }
  render() {
    const { GameboardDoneLoading } = this.props;
    if (GameboardDoneLoading) {
      return (
        <PageContainer>
          { this.renderScene() }
          <GameboardCalculator />
        </PageContainer>
      );
    }
    return <Loader />;
  }
}

const mapStatesToProps = ({ playgroundModel }) => {
  const {
    existingOpenOptions,
    existingPicks,
    GameboardDoneLoading,
    gamePrize,
    selectedGameSetting,
  } = playgroundModel;
  // console.log(gamePrize);
  return {
    existingOpenOptions,
    existingPicks,
    GameboardDoneLoading,
    gamePrize,
    selectedGameSetting,
  };
};

export default connect(mapStatesToProps)(GameboardBody);
