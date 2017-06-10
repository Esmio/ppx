import React, { Component } from 'react';
import { connect } from 'dva';
import CarouselBag from './CarouselBag';
import CenterPanel from './CenterPanel';
import PredictMap from './PredictMap';
import WinnerList from './WinnerList';
import Jackpot from './Jackpot';
import QRPanel from './QRPanel';
import History from './History';
import TutorialList from './TutorialList';
import FooterContainer from '../Footer/FooterContainer';

import { PageContainer } from '../General';
import css from '../../styles/homepage/homepageBody.less';

class HomePageContent extends Component {
	getDOMHeight(name, DOM) {
		const { dispatch } = this.props;
		if (DOM) {
			dispatch({
				type: 'layoutModel/getDOMHeight',
				payload: { name, height: DOM.offsetHeight }
			});
		}
  }
	render() {
		const { sideNavHeight } = this.props;
		const topPanelOffset = sideNavHeight - 420;
		const rightPanelStlyes = {
			float: 'left',
			transition: 'margin-top 0.3s ease',
			marginTop: `${topPanelOffset}px`,
		};
		return (
			<div className={css.homePage_body}>
				{/*<Nav />*/}
				<CarouselBag />
				<PageContainer className={css.homePage_CenterPanel}>
					<div className={css.homePage_panel__side} style={rightPanelStlyes}>
						<div ref={DOM => this.getDOMHeight('rightPanel', DOM)}>
							<div ref={DOM => this.getDOMHeight('QRPanel', DOM)}>
								<QRPanel />
							</div>
							<div>
								<History offsetHeight={topPanelOffset} />
							</div>
							<div ref={DOM => this.getDOMHeight('tutorialList', DOM)}>						
								<TutorialList />
							</div>							
						</div>
					</div>
					<div className={css.homePage_panel__center}>
						<div ref={DOM => this.getDOMHeight('centerPanel', DOM)}>
							<Jackpot />
							<CenterPanel />
						</div>
					</div>
					<div className={css.homePage_panel__side}>
						<div>
							<div ref={DOM => this.getDOMHeight('predictMap', DOM)}>
								<PredictMap />
							</div>
							<div>
								<WinnerList />
							</div>
						</div>
					</div>
				</PageContainer>
				<FooterContainer />
			</div>
		);
	}
}

const mapStatesToProps = ({ layoutModel }) => {
	const {
		lotteryCountersHeight,
		sideNavHeight
	} = layoutModel;
	return {
		lotteryCountersHeight,
		sideNavHeight
	};
};

export default connect(mapStatesToProps)(HomePageContent);
