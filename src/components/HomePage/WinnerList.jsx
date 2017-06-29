import React, { Component } from 'react';
import { connect } from 'dva';
import css from '../../styles/homepage/winnerList.less';
import { isLastItem, addCommas } from '../../utils';

class WinnerList extends Component {
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
				<li
					className={isLastItem(winnerList, bullet) ? '' : css.winnerList_listItem}
					key={`${winner.username}${index}`}
				>
					<span className={css.winnerList_listItemBullet}>{bullet}</span>
					<span className={css.winnerList_listItemUserInfo}>{this.truncate(winner.username)}</span>
					<span className={css.winnerList_listItemUserInfo}>
						{`${addCommas(winner.winningAmount)}元`}
					</span>
				</li>
			);
		});
	}
	renderList(list) {
		return (
			<ul className={css.winnerList_listBody}>
				{ this.renderListItem(list) }
			</ul>
		);
	}
	render() {
		const { winnerList } = this.props;
		return (
			<div className={css.winnerList}>
				<div>
					<h2 className={css.winnerList_header}>中奖排行榜</h2>
					<div className={css.winnerList_tableHeader}>
						<h2 className={css.winnerList_tableHeaderContent}>用户名</h2>
						<h2 className={css.winnerList_tableHeaderContent}>奖金</h2>
					</div>
				</div>
				{ winnerList && this.renderList(winnerList) }
			</div>
		);
	}
}

const mapStatesToProps = ({ homeInfoModel, layoutModel }) => {
	const { centerPanelHeight, predictMapHeight, winnerListHeaderHeight } = layoutModel;
	const { winnerList } = homeInfoModel;

	return { winnerList, centerPanelHeight, predictMapHeight, winnerListHeaderHeight };
};

export default connect(mapStatesToProps)(WinnerList);
