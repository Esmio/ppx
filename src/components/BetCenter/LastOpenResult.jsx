import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import { EllipsisLoader } from '../General';
import css from './styles/GameHeader.less';

export default class LastOpenResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props,
      openDuration: 300,
    };
  }
  render() {
    const { uniqueIssueNumber, openStatus, lastOpenResult } = this.props;
    const animationDuration = 0.2;
    if (openStatus) {
      const numbers = _.split(lastOpenResult, ',');
      return (
        <div className={css.gameHeader_gameResult}>
          <p className={css.gameHeader_headerPhase}>
            第 <strong>{ uniqueIssueNumber - 1 }</strong> 期开奖号码
          </p>
          <p className={css.gameHeader_openNumbers}>
            { this.state.lastOpenResult &&
            numbers.map((number, index) => {
              const animation = {
                animationDuration: `${animationDuration}s`,
                animationDelay: `${(animationDuration / 2) * index}s`,
              };
              return (
                <span
                  style={animation}
                  className={css.gameHeader_openNumber}
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
    return (
      <div className={css.playground_gameResult}>
        <p className={css.playground_headerPhase__grayOut}>
          正等待第<strong>{ uniqueIssueNumber - 1 }</strong>
          期开奖数据 <EllipsisLoader duration={this.state.openDuration} />
        </p>
      </div>
    );
  }
}

LastOpenResult.propTypes = {
  uniqueIssueNumber: PropTypes.number,
};
