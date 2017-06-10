import React from 'react';
import classnames from 'classnames';
import { connect } from 'dva';
import { Row, Column, MDIcon } from '../General/';
import css from '../../styles/header/marquee.less';

function Marquee({
	announcements,
	className
}) {
	function renderMarquee() {
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
	return (
		<Column width="100%" className={className}>
			<Row>
				<Column width="45%">
					<p className={css.marquee_Cs}>
						<span>客服电话：</span>
						<span>400-6666-1911</span>
						<MDIcon iconName="volume-high" className={css.marquee_icon} />
					</p>
				</Column>
				<Column  width="55%">
					{ renderMarquee() }
				</Column>
			</Row>
		</Column>
	);
}

const mapStatesToProps = ({ homeInfoModel }) => {
	const { announcements } = homeInfoModel;
	return { announcements };
};

export default connect(mapStatesToProps)(Marquee);
