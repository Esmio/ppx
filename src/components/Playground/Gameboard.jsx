import React, { Component } from 'react';
import { connect } from 'dva';
import { Loader } from '../General/';
import GameboardNav from './GameboardNav';
import GameboardSubNav from './GameboardSubNav';
import GameboardBody from './GameboardBody';
import GameboardCart from './GameboardCart';
import css from '../../styles/playground/gameboard.less';

class Gameboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameboardWidth: null
    };
  }
  onSingleGameSelectHandler(selectedGameName) {
    const { dispatch } = this.props;
    dispatch({ 
      type: 'playgroundModel/selectGame',
      payload: selectedGameName
    });
  }
  onNavSelectHandler(selectedNav, subNavOptions) {
    const { dispatch } = this.props;
    dispatch({ type: 'playgroundModel/selectNav', payload: { selectedNav, subNavOptions } });
  }
  getGameboardWidth(DOM) {
    if (DOM) {
      this.gameboardDOM = DOM;
      this.setDOMWidth(DOM);
    }
  }
  setDOMWidth(DOM) {
    const { gameboardWidth } = this.state;
    if (gameboardWidth !== DOM.offsetWidth) {
      this.setState({
        gameboardWidth: DOM.offsetWidth
      });
    }
  }
  storeNavOptions({ selectedLotUniqueId }) {
    const { dispatch } = this.props;
    dispatch({ type: 'playgroundModel/storeNavOptions', payload: selectedLotUniqueId });
  }
  renderScene() {
    const { gameboardWidth } = this.state;
    return (
      <div className={css.gameboard} ref={DOM => { this.getGameboardWidth(DOM); }}>
        <GameboardNav
          gameboardWidth={gameboardWidth}
          onSelect={this.onNavSelectHandler.bind(this)}
        />
        <GameboardSubNav
          onSelect={this.onSingleGameSelectHandler.bind(this)}
        />
        <GameboardBody />
        <GameboardCart
          onSelectNavOption={this.onNavSelectHandler.bind(this)}
          onSelectSingleGame={this.onSingleGameSelectHandler.bind(this)}
        />
      </div>
    );
  }
  render() {
    const { gameboardWidth } = this.state;
    const {
      NavDoneLoading,
      SubNavDoneLoading,
      GameboardDoneLoading,
    } = this.props;
    return (
      <div className={css.gameboard} ref={DOM => { this.getGameboardWidth(DOM); }}>
        {
          NavDoneLoading &&
          <GameboardNav
            gameboardWidth={gameboardWidth}
            onSelect={this.onNavSelectHandler.bind(this)}
          />
        }
        {
          SubNavDoneLoading &&
          <GameboardSubNav
            onSelect={this.onSingleGameSelectHandler.bind(this)}
          />
        }
        { GameboardDoneLoading &&
          <GameboardBody />
        }
        <GameboardCart
          onSelectNavOption={this.onNavSelectHandler.bind(this)}
          onSelectSingleGame={this.onSingleGameSelectHandler.bind(this)}
        />
      </div>
    );
  }
}

const mapStatesToProps = ({ playgroundModel }) => {
  const {
    navOptions,
    selectedGameName,
    selectedGameSetting,
    selectedLotInfo,
    selectedLotSettings,
    selectedLotUniqueId,
    selectedNav,
    subNavOptions,
    GameboardDoneLoading,
    NavDoneLoading,
    SubNavDoneLoading,
  } = playgroundModel;
  return {
    navOptions,
    selectedGameName,
    selectedGameSetting,
    selectedLotInfo,
    selectedLotSettings,
    selectedLotUniqueId,
    selectedNav,
    subNavOptions,
    GameboardDoneLoading,
    NavDoneLoading,
    SubNavDoneLoading,
  };
};

export default connect(mapStatesToProps)(Gameboard);
