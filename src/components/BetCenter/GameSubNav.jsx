import React, { Component } from 'react';
import { MDIcon } from '../General';
import css from './styles/GameNav.less';

class GameSubNav extends Component {
  renderSubnav(subGroup) {
    const { onMethodSelect } = this.props;
    return _.map(subGroup, (method) => {
      const { methodId, gameMethod } = method;
      if (gameMethod) {
        const nameArray = _.split(method.gameMethod, '-');
        const displayName = nameArray[1] || nameArray[0];
        const buttonActive =
          gameMethod === this.props.gameMethod &&
          methodId === this.props.methodId;
        return (
          <button
            key={gameMethod} className={css.gameSubnav_btn}
            onClick={onMethodSelect.bind(this, method)}
            data-active={buttonActive}
          >
            { displayName }
          </button>
        );
      } return null;
    });
  }
  renderSubGroup() {
    const { gameSubNav } = this.props;
    return _.map(gameSubNav, (subGroup, subGroupName) => {
      return (
        <div className={css.gameSubnav} key={subGroupName}>
          <span className={css.gameSubnav_label}>{ subGroupName }</span>
          <MDIcon className={css.gameSubnav_chevron} iconName="chevron-right" />
          { this.renderSubnav(subGroup) }
        </div>
      );
    });
  }
  render() {
    return (
      <div className={css.gameSubnavs}>
        { this.renderSubGroup() }
      </div>
    );
  }
}

export default GameSubNav;
