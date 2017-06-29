import React, { Component } from 'react';
import { Link } from 'dva/router';
import _ from 'lodash';
import { connect } from 'dva';
import { MDIcon } from '../General';
import css from '../../styles/header/sideNav.less';

class SideNav extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showingMore: false,
		};
		this.onShowMoreToggle = this.onShowMoreToggle.bind(this);
		this.dispatch = this.props.dispatch.bind(this);
	}
	onGameSelect(thisGameId) {
		this.dispatch({
			type: 'betCenter/updateState',
			payload: { thisGameId }
		});
	}
	onShowMoreToggle() {
		const { showingMore } = this.state;
		this.setState({ showingMore: !showingMore });
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
						onClick={this.onGameSelect.bind(this, gameUniqueId, lottery)}
						className={css.sideNav_permalink__recommend}
					>
						{gameNameInChinese}
					</Link>
				);
			}
		);
  }
	renderExtraList(extraList) {
		const { showingMore } = this.state;
		if (showingMore) {
			return _.map(extraList, (lottery, index) => {
				const { gameUniqueId, gameNameInChinese, gameIconUrl } = lottery;
				const animationDelay = `${0.1 * index}s`;
				return (
					<div
						style={{ animationDelay }}
						className={css.sideNav_lotBox__extra}
						onClick={this.onGameSelect.bind(this, gameUniqueId, lottery)}
						key={gameUniqueId + index}
					>
						<img
							className={css.sideNav_thumbnail}
							src={gameIconUrl} alt={gameNameInChinese}
						/>
						<p className={css.sideNav_listName}>
							{gameNameInChinese}
						</p>
					</div>
				);
			});
		} return null;
	}
	renderList() {
		const { gameInfosHot, gameInfosRecommend } = this.props;
		const { showingMore } = this.state;
		const highList = _.filter(gameInfosRecommend, ['frequency', 'HIGH']);
		const extraList = _.differenceBy(
			[...highList],
			[...gameInfosHot],
			'gameUniqueId'
		);
		const transitionDuration = `${extraList.length * 0.1}s`;
		const list = [...gameInfosHot];
		const listClass = showingMore ?
			css.sideNav_lotList__expanded : css.sideNav_lotList;
		if (list.length) {
			return (
				<div className={css.sideNav_lotSection}>
					<h4 className={css.sideNav_listLabel}>
						<MDIcon iconName="timer" />高率彩
					</h4>
					<div
						className={listClass} style={{ transitionDuration }}
					>
						{
							_.map(list, (lottery, index) => {
								const { gameUniqueId, gameNameInChinese, gameIconUrl } = lottery;
								return (
									<div
										className={css.sideNav_lotBox}
										onClick={this.onGameSelect.bind(this, gameUniqueId)}
										key={gameUniqueId + index}
									>
										<Link to="/test">
											<img
												className={css.sideNav_thumbnail}
												src={gameIconUrl} alt={gameNameInChinese}
											/>
											<p className={css.sideNav_listName}>
												{gameNameInChinese}
											</p>
										</Link>
									</div>
								);
							})
						}
						{ this.renderExtraList(extraList) }
						<div className={css.sideNav_lotBox}>
							<button
								onClick={this.onShowMoreToggle}
								className={css.sideNav_moreBtn}
							>
								彩
							</button>
							<p className={css.sideNav_listName}>
								{ showingMore ? '隐藏' : '更多' }
							</p>
						</div>
					</div>
				</div>
			);
		} return null;
	}
	renderLowFreqList() {
		const { gameInfosRecommend } = this.props;		
		const lowFreqList = _.filter([...gameInfosRecommend], ['frequency', 'LOW']);
		if (lowFreqList.length) {
			return (
				<div className={css.sideNav_lotSection}>
					<h4 className={css.sideNav_listLabel}>
						<MDIcon iconName="timer-sand" />低率彩
					</h4>
					<div className={css.sideNav_lotList}>
						{
							_.map(lowFreqList, (lottery, index) => {
								const { gameUniqueId, gameNameInChinese, gameIconUrl } = lottery;
								return (
									<div
										className={css.sideNav_lotBox}
										onClick={this.onGameSelect.bind(this, gameUniqueId)}
										key={gameUniqueId + index}
									>
										<Link to="/test">
											<img
												className={css.sideNav_thumbnail}
												src={gameIconUrl} alt={gameNameInChinese}
											/>
											<p className={css.sideNav_listName}>
												{gameNameInChinese}
											</p>
										</Link>
									</div>
								);
							})
						}
					</div>
				</div>
			);
		} return null;
	}
	render() {
		return (
			<div className={css.sideNav}>
				{ this.renderList() }
				{ this.renderLowFreqList() }
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
