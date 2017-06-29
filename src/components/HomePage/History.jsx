import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import moment from 'moment';
import { EllipsisLoader } from '../General';
import css from '../../styles/homepage/history.less';
import { addCommas } from '../../utils';
import {routerRedux} from 'dva/router';
import {hasTrendChart} from '../../utils';

class History extends Component {
	constructor(props) {
		super(props);
		this.state = {
			histories: [],
			maxHeight: null
		};
	}
	componentWillMount() {
		if (this.props.allHistory) {
			// console.debug('componentWillMount', this.props.allHistory);
			this.setState({
				histories: this.storeAnnoucement(this.props)
			});
		}
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.allHistory && nextProps.allHistory !== this.props.allHistory) {
			// console.debug('componentWillReceiveProps', nextProps.allHistory);
			this.setState({
				histories: this.storeAnnoucement(nextProps)
			});
		}
	}

	storeAnnoucement({ allHistory }) {
		const newHistories = [];
		allHistory.forEach((history) => {
			const {
				gameNameInChinese,
				openTime,
				gameUniqueId,
				openCode,
				uniqueIssueNumber
			} = history;
			newHistories.push(
				<li
					key={gameNameInChinese + uniqueIssueNumber}
					className={css.history_listItem}
				>
					<div>
						<div>
							<p className={css.history_lotName}>{gameNameInChinese}</p>		
							<p className={css.history_lotDate}>
								{moment(openTime).format('YYYY-MM-DD')}
							</p>
						</div>
						<p className={css.history_lotPhase}>
							<span>第{addCommas(uniqueIssueNumber)}期</span> 
						</p>
					</div>
					{ 
						openCode ?
						this.renderLotBalls(openCode) : 
						<p className={css.history_awaitMsg}>正在开奖 <EllipsisLoader duration={5000} /></p>
					}
					<p className={css.history_permalinks}>
						<a href="" className={css.history_permalink}>奖金计算器</a>
						<a href="" className={css.history_permalink}>详情</a>
						{hasTrendChart(gameUniqueId) ? <a href={`${location.href}trend?gameUniqueId=${gameUniqueId}`} className={css.history_permalink}>走势</a> : null}
						<a href="" className={css.history_permalink}>投注</a>
					</p>
				</li>
			);
		}, this);
		return newHistories;
	}
	renderLotBalls(numbers) {
		const lotteryNumbers = _.split(numbers, ',');
		return (
			<p className={css.history_numbers}>
				{
					lotteryNumbers.map((number, index) => {
						return <span key={index} className={css.history_number}>{number}</span>;
					})
				}
			</p>
		);
	}
	handleMoreClick(){
		const {dispatch} = this.props;
		dispatch(routerRedux.push({
			pathname: 'award'
		}))
	}
	render() {
		const { histories } = this.state;
		return (
			<div className={css.history_panel}>
				<div className={css.history_headers}>
					<h4 className={css.history_header}>开奖公告</h4>
					<h3 className={css.history_btn__loadMore} onClick={this.handleMoreClick.bind(this)}>更多</h3>
				</div>
				<div className={css.history_list}>
					{ histories }
				</div>
			</div>
		);
	}
}

const mapStatesToProps = ({ layoutModel, gameInfosModel }) => {
	const {
		centerPanelHeight,
		QRPanelHeight,
		tutorialListHeight,
		lotteryNoticeHeaderHeight
	} = layoutModel;
	const {
		allHistory
	} = gameInfosModel;
	return {
		allHistory,
		centerPanelHeight,
		QRPanelHeight,
		tutorialListHeight,
		lotteryNoticeHeaderHeight
	};
};

export default connect(mapStatesToProps)(History);
