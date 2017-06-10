import React, { Component } from 'react';
import { Link } from 'dva/router';
import classnames from 'classnames';
import _ from 'lodash';
import { TimelineLite } from 'gsap';
import { connect } from 'dva';
import {
	Column,
	MDIcon,
	Row
} from '../General';
import HotLot from './HotLot';
import css from '../../styles/header/sideNav.less';

class SideNav extends Component {
	constructor(props) {
		super(props);
		this.state = {
			animDuration: 0.3,
			sectionExpanded: false,
			sideNavTimeline: new TimelineLite({
				onComplete: () => {
					this.getDOMHeight('sideNav', this.sideNav);
				}
			})
		};
		this.sideNavList = {};
	}
	setDOM(name, DOM) {
		if (DOM && this[name] !== DOM) {
			this[name] = DOM;
		}
	}
	setAccordianDOM(name, DOM) {
		if (DOM && this.sideNavList[name] !== DOM) {
			this.sideNavList[name] = DOM;
			this.sideNavList[name].expanded = false;
		}
	}
	getDOMHeight(name, DOM) {
		const { dispatch } = this.props;
		if (DOM) {
			dispatch({
				type: 'layoutModel/getDOMHeight',
				payload: { name, height: DOM.offsetHeight }
			});
		}
  }
	gameSelectionHandler(gameUniqueId, lotInfos) {
		const { dispatch, allGamesPrizeSettings } = this.props;
		const lotSettings = allGamesPrizeSettings[gameUniqueId];
		// console.debug('gameSelectionHandler', gameUniqueId, lotSettings);
		dispatch({
			type: 'playgroundModel/getSelectedLotInfos',
			payload: {
				lotUniqueId: gameUniqueId, lotSettings, lotInfos
			}
		});
	}
	toggleExpansion(targetList) {
		// defining target DOM
		const { sideNavTimeline, animDuration } = this.state;
		const sideNavList = this.sideNavList;
		const HotLotList = this.HotLotList;
		const expandList = sideNavList[targetList];
		const expandChilds = expandList.children;
		const siblings = [];
		const siblingsChilds = [];
		_.forEach(sideNavList, (DOM, listName) => {
			if (listName !== targetList) {
				siblings.push(DOM);
				siblingsChilds.push(DOM.children);
			}
		});
		const { highFreqList, lowFreqList, allRecommendList } = sideNavList;

		// toggle the status
		expandList.expanded = !expandList.expanded;
		_.forEach(siblings, (DOM, listName) => {
			siblings[listName].expanded = false;
		});

		// defining conditions
		const listShouldCollapse = () => expandList.expanded === false;
		const listShouldExpand = () => expandList.expanded === true;
		const hotLotListShouldExpand = () => 
				highFreqList.expanded === false &&
				lowFreqList.expanded === false &&
				allRecommendList.expanded === false;
		const hotLotListShouldCollapse = () => hotLotListShouldExpand() === false;

		if (listShouldExpand()) {
			sideNavTimeline
			.add('expand')
			.set(expandList, { height: 'auto' })
			.from(expandList, animDuration, { height: '55px' }, 'expand')
			.to(expandChilds, animDuration, { width: '100%' }, 'expand')
			.to(siblings, animDuration, { height: '55px' }, 'expand')
			.to(siblingsChilds, animDuration, { width: '50%' }, 'expand');
		} else if (listShouldCollapse()) {
			sideNavTimeline
			.add('collapse')
			.to(expandList, animDuration, { height: '55px' }, 'collapse')
			.to(expandChilds, animDuration, { width: '50%' }, 'collapse');
		}
		if (hotLotListShouldExpand()) {
			sideNavTimeline
			.set(HotLotList, { height: 'auto', opacity: 1 }, 'collapse')
			.from(HotLotList, animDuration, { height: 0, opacity: 0 }, 'collapse');
		} else if (hotLotListShouldCollapse()) {
			sideNavTimeline.to(HotLotList, animDuration, { height: 0, opacity: 0 }, 'expand');
		}
	}
	renderRecommendLotList(list) {
		return list.map(
			(lottery, key) => {
				const { gameNameInChinese, gameUniqueId } = lottery;
				// console.debug(lottery);
				return (
					<Link
						key={gameUniqueId + key}
						to="/playground"
						onClick={this.gameSelectionHandler.bind(this, gameUniqueId, lottery)}
						className={css.sideNav_permalink__recommend}
					>
						{gameNameInChinese}
					</Link>
				);
			}
		);
  }
	renderHotLotList(gameInfosHot) {
		// console.debug(gameInfosHot);
		return (
			<div
				className={css.list_lottery__hot}
				ref={DOM => this.setDOM('HotLotList', DOM)}
			>
				{
					gameInfosHot.map((lottery, key) => {
						const {
							gameUniqueId
						} = lottery;
						return (
							<HotLot
								onClick={this.gameSelectionHandler.bind(this, gameUniqueId, lottery)}
								lottery={lottery}
								key={gameUniqueId + key}
							/>
						);
					})
				}
			</div>
		);
	}
	renderInfosRecommend(gameInfosRecommend) {
		// console.debug(gameInfosRecommend);
		const highFreqList = [];
		const lowFreqList = [];
		_.forEach(gameInfosRecommend, (infoObject) => {
			// console.debug(infoObject);			
			if (infoObject.frequency === 'LOW') {
				lowFreqList.push(infoObject);
			} else if (infoObject.frequency === 'HIGH') {
				highFreqList.push(infoObject);
			}
		});
		return (
			<Row>
				<Row className={css.sideNav_list}>
					<button
						className={css.sideNav_accordianBtn}
						disabled={gameInfosRecommend.length <= 6}
						onClick={this.toggleExpansion.bind(this, 'allRecommendList')}
					>
						<h5 className={css.sideNav_accordianBtnIcon__all}>彩</h5>
						<h5>全部</h5>
					</button>
					<div 
						className={css.list_lottery}
						ref={DOM => this.setAccordianDOM('allRecommendList', DOM)}
					>
						{ this.renderRecommendLotList(gameInfosRecommend) }
					</div>
				</Row>
				<Row className={css.sideNav_list}>
					<button
						className={css.sideNav_accordianBtn}
						disabled={highFreqList.length <= 6}
						onClick={this.toggleExpansion.bind(this, 'highFreqList')}
					>
						<MDIcon iconName="alarm" className={css.sideNav_accordianBtnIcon} />
						<h5>高频彩</h5>
					</button>
					<div className={css.list_lottery} ref={DOM => this.setAccordianDOM('highFreqList', DOM)}>
						{ this.renderRecommendLotList(highFreqList) }
					</div>
				</Row>
				<Row className={css.sideNav_list}>
					<button
						className={css.sideNav_accordianBtn}
						disabled={lowFreqList.length <= 6}
						onClick={this.toggleExpansion.bind(this, 'lowFreqList')}
					>
						<MDIcon iconName="clock" className={css.sideNav_accordianBtnIcon} />							
						<h5>低频彩</h5>
					</button>
					<div
						className={css.list_lottery}
						ref={DOM => this.setAccordianDOM('lowFreqList', DOM)}
					>						
						{ this.renderRecommendLotList(lowFreqList) }
					</div>							
				</Row>
			</Row>
		);
	}
			
	renderScene() {
		const { gameInfosHot, gameInfosRecommend } = this.props;
		return (
			<Column width="100%">
				{ gameInfosHot && this.renderHotLotList(gameInfosHot) }
				{ gameInfosRecommend && this.renderInfosRecommend(gameInfosRecommend) }
			</Column>
		);
		// return <Loader />;
	}
	render() {
		const { className, style } = this.props;
		const sideNavClasses = classnames(css.sideNav, className);
		return (
			<div
				style={style}
				className={sideNavClasses}
				ref={DOM => {
					this.setDOM('sideNav', DOM);
					this.getDOMHeight('sideNav', DOM);
				}}
			>
				{ this.renderScene() }
			</div>
		);
	}
}

const mapStatesToProps = ({ layoutModel, gameInfosModel }) => {
	const { sideNavHeight, shouldShowSideNav } = layoutModel;
	const {
		gameInfosHot,
		gameInfosRecommend,
		allGamesPrizeSettings
 } = gameInfosModel;
	return {
		allGamesPrizeSettings,
		gameInfosHot,
		gameInfosRecommend,
		sideNavHeight,
		shouldShowSideNav
	};
};

export default connect(mapStatesToProps)(SideNav);
