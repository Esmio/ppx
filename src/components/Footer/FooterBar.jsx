import React from 'react';
import { PageContainer, Row, Column } from '../General';
import css from '../../styles/footer/footerBar.less';
import partnersLogo from '../../assets/image/partners.png';
import QRCode from '../../assets/image/iphone_QR.png';

export default function FooterBar() {
	return (
		<Row className={css.footer}>
			<Row>
				<PageContainer className={css.footer_pageWidthContainer}>
					<Column className={css.footer_disclaimer} width="80%">
						<p>2017©106彩票 版权所有 |  彩票网址：http://www.106.com</p>
						<p>106彩票郑重提示：彩票有风险，投注需谨慎！我们积极推行负责任博彩, 并极力拒绝未成年玩家使用我们的软体进行网上娱乐。</p>
					</Column>	
					<Column className={css.footer_agency} width="20%" float="right">
							<Row>
								<p className={css.footer_icon}>&#xe872;</p>
								<p className={css.footer_agencyTypography}>
									<span className={css.footer_agencyFirstLetter}>A</span>代理合营<br />gency
								</p>
								<p>
									<a href="" className={css.footer_permalink}>加入代理</a>|
									<a href="" className={css.footer_permalink}>合营政策</a>
								</p>
							</Row>
					</Column>
				</PageContainer>
			</Row>
			<hr className={css.footer_divider} />
			<Row>
				<PageContainer className={css.footer_pageWidthContainer}>
					<img src={partnersLogo} alt="Partners" />
					<Column float="right" className={css.footer_QRCode}>
						<img src={QRCode} alt="Mobile Site" height="110" width="110" />
						<p>106彩票手机站</p>
					</Column>
				</PageContainer>
			</Row>
		</Row>
	);
}

