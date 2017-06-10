import React, { Component } from 'react';
import { connect } from 'dva';
import css from '../../styles/playground/gameboard.less';
import { getDisplayName, getSettingKey } from '../../utils/';
import { Row, Column, MDIcon } from '../General/';

class GameboardSubNav extends Component {
  componentWillMount() {
    const { SubNavDoneLoading, selectedGameName } = this.props;
    if (SubNavDoneLoading && _.isEmpty(selectedGameName)) {
      this.selectDefault(this.props);
    }
  }
  componentWillReceiveProps(nextProps) {
    const { SubNavDoneLoading, selectedGameName } = nextProps;
    if (SubNavDoneLoading && _.isEmpty(selectedGameName)) {
      this.selectDefault(nextProps);
    }
  }
  selectDefault({ subNavOptions, selectedNav, onSelect }) {
    // console.debug(_.isEmpty(selectedGameName));
    const subGroupName = _.keys(subNavOptions)[0];
    const singleGameName = subNavOptions[subGroupName][0];
    const displayName = getDisplayName(singleGameName, subGroupName);
    const gameSettingMapKey = getSettingKey(selectedNav, displayName);
    // console.debug('gameSettingMapKey', subGroupName, singleGameName, gameSettingMapKey);
    onSelect(gameSettingMapKey);
  }
  groupNameNotRepeat(name, pairTarget) {
    return name.indexOf(pairTarget) < 0;
  }
  renderSingleOptions(subGroupsArry, subGroupName) {
    const { selectedNav, selectedGameName, onSelect } = this.props;
    return (
      <Row className={css.gameboard_subButtons}>
        {
          _.map(subGroupsArry, (singleGameName) => {
            const displayName = getDisplayName(singleGameName, subGroupName);
            const gameSettingMapKey = getSettingKey(selectedNav, displayName);
            const buttonIsActive = gameSettingMapKey === selectedGameName;
            return (
              <button
                onClick={onSelect.bind(this, gameSettingMapKey)}
                className={
                  css[buttonIsActive ? 'gameboard_subButton__active' : 'gameboard_subButton']
                }
                key={displayName}
              >
                {
                  this.groupNameNotRepeat(singleGameName, subGroupName) ? 
                  displayName : singleGameName
                }
              </button>
            );
          })
        }
      </Row>
    );
  }
  render() {
    const { subNavOptions } = this.props;
    return (
      <Row className={css.gameboard_subGroups}>
        {
          _.map(subNavOptions, (subGroupsArry, subGroupName) => {
            return (
              <Row key={subGroupName}>
                <Column>
                  <p className={css.gameboard_subGroupLabel}>
                    {subGroupName}
                    <MDIcon className={css.gameboard_subGroupIcon} iconName="chevron-right" />
                  </p>
                </Column>
                <Column>
                  { this.renderSingleOptions(subGroupsArry, subGroupName) }
                </Column>
              </Row>
            );
          })
        }
      </Row>
    );
  }
}

const mapStatesToProps = ({ playgroundModel }) => {
 const { SubNavDoneLoading, subNavOptions, selectedNav, selectedGameName } = playgroundModel;
 return { SubNavDoneLoading, subNavOptions, selectedNav, selectedGameName };
};

export default connect(mapStatesToProps)(GameboardSubNav);
