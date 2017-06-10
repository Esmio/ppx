import React, { Component } from 'react';
import { Link } from 'dva/router';
import { Image, Text, Column, Row } from '../General/';
import lessVar from '../../styles/variables.less';
import css from '../../styles/header/sideNav.less';

class HotLot extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loaded: false
		};
	}
	onThumbLoaded() {
		this.setState({ loaded: true });
	}
  gameIsUnavailable(lottery) {
    return lottery.gameUniqueId === 'UNRECOGNIZED';
  }
	
  render() {
		const { lottery, onClick } = this.props;
		const { 
			gameDescription,
			gameIconUrl,  
			gameNameInChinese
		} = lottery;
		const { loaded } = this.state;
    const indecator = this.gameIsUnavailable(lottery) ? '即将来临' : '火热！';
    const indicatorClassExtension = this.gameIsUnavailable(lottery) ? '__disabled' : '__hot';
    return (
      <Link
        to={{ pathname: '/playground' }}
        onClick={onClick}
        disabled={this.gameIsUnavailable(lottery)}
        className={css.sideNav_permalink__hot}
      >
        <Column width="30%" className={css.sideNav_thumbnail}>
          <Image
            height={lessVar.size6}
            width={lessVar.size6}											
            borderRadius="50%"
						onLoad={this.onThumbLoaded.bind(this)}
            imgUrl={gameIconUrl}
            imgAlt={gameDescription}
            className={css.sideNav_thumbnailImg}
          />
        </Column>
        <Row className={css.sideNav_lottery__hot}>
          <Text
            loaderOffset={0.4}
            loaderBuffer={1.4}
            loaded={loaded}
            className={css.sideNav_lotteryName__hot}
          >
            { gameNameInChinese }
          </Text>
          <Text
            loaderOffset={0.8}
            loaded={loaded}
            size={2}
            className={css[`sideNav_lotteryType${indicatorClassExtension}`]}
          >
            { indecator }
          </Text>
        </Row>
      </Link>
    );
  }
}

export default HotLot;
