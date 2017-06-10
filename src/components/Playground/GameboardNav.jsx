import React, { Component } from 'react';
import { connect } from 'dva';
import css from '../../styles/playground/gameboard.less';

class GameboardNav extends Component {
  renderScene() {
    const { gameboardWidth, navOptions, selectedNav, onSelect } = this.props;
        // console.debug(navOptions);
    return (
      <div className={css.gameboard_header} style={{ height: gameboardWidth }}>
        { 
          _.map(navOptions, (subNavOptions, optionName) => {
            const navIsActive = optionName === selectedNav;
            return (
              <a
                onClick={onSelect.bind(this, optionName, subNavOptions)}
                className={css[navIsActive ? 'gameboard_navButton__active' : 'gameboard_navButton']}
                key={optionName}
              >
                { optionName }
              </a>
            );
          })
        }
      </div>
    );
  }
  render() {
    const { NavDoneLoading } = this.props;
    if (NavDoneLoading) {
      return this.renderScene();
    }
    return null;
  }
}

const mapStatesToProps = ({ playgroundModel }) => {
  const { NavDoneLoading, selectedNav, navOptions } = playgroundModel;
  return { NavDoneLoading, selectedNav, navOptions };
};

export default connect(mapStatesToProps)(GameboardNav);
