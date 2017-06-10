import React, { Component } from 'react';
import { connect } from 'dva';
import css from '../../styles/homepage/winnerList.less';
import lessVar from '../../styles/variables.less';
import { Row, ListView } from '../General';
import { isLastItem, addCommas, stripUnit } from '../../utils';

class WinnerList extends Component {
	getDOMHeight(name, DOM) {
		const { dispatch } = this.props;
		if (DOM) {
			dispatch({
				type: 'layoutModel/getDOMHeight',
				payload: {
					name,
					height: DOM.offsetHeight
				}
			});
		}
	}
	truncate(username = '用户') {
		let name = username;
		if (username.length > 3) {
			name = `${username.substr(0, 3)}***`;
			return name;
		}
		return name;
	}
	renderListItem(list) {
		const { winnerList } = this.props;
		return list.map((winner, index) => {
			const bullet = index + 1;
			// console.debug(winner);
			return (
				<div
					className={isLastItem(winnerList, bullet) ? '' : css.winnerList_listItem}
					key={`${winner.username}${index}`}
				>
					<p className={css.winnerList_listItemBullet}>{bullet}</p>
					<p className={css.winnerList_listItemUserInfo}>{this.truncate(winner.username)}</p>
					<p className={css.winnerList_listItemUserInfo}>{`${addCommas(winner.winningAmount)}元`}</p>
				</div>
			);
		});
	}
	renderList(list) {
		const {
			centerPanelHeight, 
			predictMapHeight,
			winnerListHeaderHeight,
		} = this.props;
		const winnerListMargin = stripUnit(lessVar.size2) * stripUnit(lessVar.baseSize);
		const maxHeight =
			centerPanelHeight -
			predictMapHeight -
			winnerListHeaderHeight -
			winnerListMargin;
		
		return (
			<div
				className={css.winnerList_listBody}
				style={{ height: `${maxHeight}px` }}
				ref={DOM => this.getDOMHeight('winnerList', DOM)}
			>
				{/*{ console.debug(
				'maxHeight',
				centerPanelHeight,
				predictMapHeight,
				winnerListHeaderHeight,
				winnerListMargin,
				maxHeight) }*/}
				{ this.renderListItem(list) }
			</div>
		);
	}
	render() {
		const { winnerList } = this.props;
		return (
			<Row className={css.winnerList}>
				<div ref={DOM => this.getDOMHeight('winnerListHeader', DOM)}>
					<h2 className={css.winnerList_header}>中奖排行榜</h2>
					<div className={css.winnerList_tableHeader}>
						<h2 className={css.winnerList_tableHeaderContent}>用户名</h2>
						<h2 className={css.winnerList_tableHeaderContent}>奖金</h2>
					</div>
				</div>
				{ winnerList && this.renderList(winnerList) }
			</Row>
		);
	}
}

const mapStatesToProps = ({ homeInfoModel, layoutModel }) => {
	const { centerPanelHeight, predictMapHeight, winnerListHeaderHeight } = layoutModel;
	const { winnerList } = homeInfoModel;

	return { winnerList, centerPanelHeight, predictMapHeight, winnerListHeaderHeight };
};

export default connect(mapStatesToProps)(WinnerList);
