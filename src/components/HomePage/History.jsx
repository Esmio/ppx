import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Column } from '../General';
import css from '../../styles/homepage/history.less';
import lessVar from '../../styles/variables.less';
import { addCommas, stripUnit } from '../../utils';

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
	
	getDOMHeight(name, DOM) {
		const { dispatch } = this.props;
		if (DOM) {
			dispatch({
				type: 'layoutModel/getDOMHeight',
				payload: { name, height: DOM.offsetHeight }
			});
		}
  }

	storeAnnoucement({ allHistory }) {
		const newHistories = [];
		allHistory.forEach((history) => {
			const {
				gameNameInChinese,
				openTime,
				openCode,
				uniqueIssueNumber
			} = history;
			newHistories.push(
				<Row
					key={gameNameInChinese + uniqueIssueNumber}
					className={css.history_listItem}
				>
					<Row>
						<Row>
							<p className={css.history_lotName}>{gameNameInChinese}</p>		
							<p className={css.history_lotDate}>
								{moment(openTime).format('YYYY-MM-DD')}
							</p>
						</Row>
						<p className={css.history_lotPhase}>
							<span>第{addCommas(uniqueIssueNumber)}期</span> 
						</p>
					</Row>
					{ this.renderLotBalls(openCode) }
					<Row>
						<Column float="right">
							<p>
								<a href="" className={css.history_permalink}>奖金计算器</a>
								<a href="" className={css.history_permalink}>详情</a>
								<a href="" className={css.history_permalink}>走势</a>
								<a href="" className={css.history_permalink}>投注</a>
							</p>
						</Column>
					</Row>
				</Row>
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
	renderHistories(histories) {
		function renderItem() {
			return histories.map((history) => {
				// console.debug(history);

				return (history);
			});
		}
		return renderItem;
	}
	renderScene(histories) {
		const historyMargin = (stripUnit(lessVar.size2) * 2) * stripUnit(lessVar.baseSize);
		const { centerPanelHeight, 
		offsetHeight,
		QRPanelHeight,
		tutorialListHeight,
		lotteryNoticeHeaderHeight } = this.props;
		const maxHeight = 
		centerPanelHeight - 
		offsetHeight -
		QRPanelHeight -
		tutorialListHeight -
		lotteryNoticeHeaderHeight -
		historyMargin;
		// offsetHeight,
		// QRPanelHeight,
		// tutorialListHeight,
		// lotteryNoticeHeaderHeight, historyMargin, maxHeight);
		return (
			<Row>
				<div ref={DOM => this.getDOMHeight('lotteryNoticeHeader', DOM)}>
					<Row>
						<Column width="80%">
							<h4 className={css.history_header}>开奖公告</h4>
						</Column>
						<Column width="20%">
							<h3 className={css.history_btn__loadMore}>更多</h3>
						</Column>
					</Row>
				</div>
				<Column className={css.history_list} width="100%" style={{ height: `${maxHeight}px` }}>
					{ histories }
				</Column>
			</Row>
		);
	}
	render() {
		const { histories } = this.state;
		return (
			<Row className={css.history_panel}>
				{ histories && this.renderScene(histories) }
			</Row>
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
