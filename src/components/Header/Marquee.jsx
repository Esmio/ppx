import React, { Component } from 'react';
import { Row, Column, MDIcon } from '../General/';
import css from '../../styles/header/marquee.less';


class Marquee extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  renderMarquee() {
    const { announcements } = this.props;
    if (announcements) {
      const duration = 25 * announcements.length;
      return (
        <div className={css.marquee}>
          <p
            className={css.marquee_body}
            style={{ animationDuration: `${duration}s` }}
          >
            {
              announcements.map((news, key) => {
                return (
                  <span key={key} className={css.marquee_content}>
										{news.createTime} : {news.content}
									</span>
                );
              })
            }
          </p>
        </div>
      );
    }
    return null;
  }
  render() {
    return (
      <Column width="100%">
        <Row>
          <Column width="45%">
            <p className={css.marquee_Cs}>
              <span>客服电话：</span>
              <span>400-6666-1911</span>
              <MDIcon iconName="volume-high" className={css.marquee_icon} />
            </p>
          </Column>
          <Column width="55%">
            { this.renderMarquee() }
          </Column>
        </Row>
      </Column>
    );
  }
}

export default Marquee;
