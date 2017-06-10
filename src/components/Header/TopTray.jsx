import React from 'react';
import TopLinks from './TopLinks';
import Marquee from './Marquee';
import { PageContainer } from '../General/';
import css from '../../styles/header/header.less';

function TopTray() {
  return (
    <div className={css.header_topTray}>
      <PageContainer>
        <div className={css.header_marquee} >
          <Marquee />
        </div>
        <TopLinks />
      </PageContainer>
    </div>
  );
}
export default TopTray;
