import React, { Component } from 'react';
import TopLinks from './TopLinks';
import Marquee from './Marquee';

import css from '../../styles/header/header.less';

class TopTray extends Component {
  render() {
    return (
      <div className={css.header_topTray}>
        <div className={css.header_marquee} >
          <Marquee announcements={this.props.announcements} />
        </div>
        <TopLinks />
      </div>
    );
  }
}
export default TopTray;
