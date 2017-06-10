import React from 'react';
import { PageContainer, Row, Column, MDIcon } from '../General';
import css from '../../styles/footer/sitemap.less';
import logo106 from '../../assets/image/logo.png';

export default function Sitemap() {
	function renderIcon(hexcode) {
		return <span className={css.sitemap_labelIcon}>{hexcode}</span>;
	}

	function renderListItem(placeholder, permalink) {
		const isLink = permalink && typeof permalink === 'string';
		const linkEmpty = permalink === '';
		
		if (isLink && !linkEmpty) {
			return (
				<li className={css.sitemap_listItem} key={placeholder}>
					<a className={css.sitemap_permalink} href={permalink}>{ placeholder } </a>
				</li>
			);
		} else if (linkEmpty) {
			return <li className={css.sitemap_listItem} key={placeholder}>{ placeholder }</li>;
		} else if (typeof permalink === 'object') {
			const links = [];

			for (const innerPlaceholder in permalink) {
				if (permalink[innerPlaceholder]) {
					const inlinePermalink = permalink[innerPlaceholder];

					links.push(
						<a
							className={css.sitemap_permalink__inline}
							href={inlinePermalink}
							key={innerPlaceholder}
						>
							{ innerPlaceholder }
						</a>
					);
				}
			}
			return <li className={css.sitemap_listItem} key={placeholder}>{placeholder}{links}</li>;
		}
		
		return null;
	}

	function renderList(label, list) {
		if (label && list) {
			const mapList = [];

			for (const listItem in list) {
				if (list[listItem]) {
					const { placeholder, permalink } = list[listItem];

					mapList.push(
						renderListItem(placeholder, permalink)
					);
				}
			}

			return (
				<Column>
					<h3 className={css.sitemap_label}>{ label }</h3>
					<ul className={css.sitemap_list}>
						{ mapList }
					</ul>
				</Column>
			);
		}

		return null;
	}

	function renderSitemap(sitemapData) {
		if (sitemapData) {
			const sitemaps = [];
			
			for (const mapName in sitemapData) {
				if (sitemapData[mapName]) {
					const { list, iconUnicode } = sitemapData[mapName];
					
					sitemaps.push(
						<Column className={css.sitemap_column} key={mapName} >
							<div className={css.sitemap_columnBody}>
								<Column>
									{ renderIcon(iconUnicode) }
								</Column>
								{ renderList(mapName, list) }
							</div>
						</Column>
					);
				}
			}

			return (
				<Row>
					{ sitemaps }
				</Row>
			);
		}

		return null;
	}

	return (
		<Row className={css.sitemap}>
			<PageContainer className={css.sitemap_body}>
					<Column width="25%">
						<img src={logo106} alt="106 彩票" />
						<Row className={css.sitemap_benefits}>
							<p className={css.sitemap_benefit}>
								<MDIcon iconName="checkbox-marked" className={css.sitemap_checkbox} />账户安全
							</p>
							<p className={css.sitemap_benefit}>
								<MDIcon iconName="checkbox-marked" className={css.sitemap_checkbox} />
								购彩便捷
							</p>
							<p className={css.sitemap_benefit}>
								<MDIcon iconName="checkbox-marked" className={css.sitemap_checkbox} />
								兑奖简单
							</p>
							<p className={css.sitemap_benefit}>
								<MDIcon iconName="checkbox-marked" className={css.sitemap_checkbox} />
								提款快速
							</p>
						</Row>
					</Column>
					<Column float="right">
						{ renderSitemap(sitemapData) }
					</Column>
			</PageContainer>
		</Row>
	);
}

const sitemapData = {
	账户相关: {
		iconUnicode: '\uE60A',
		list: [
			{
				placeholder: '如何注册账号',
				permalink: 'http://www.baidu.com'
			},
			{
				placeholder: '怎么找回登录密码',
				permalink: 'http://www.baidu.com'
			},
			{
				placeholder: '如何修改手机号码',
				permalink: 'http://www.baidu.com'
			},
			{
				placeholder: '如何修改真实姓名',
				permalink: 'http://www.baidu.com'
			},
		]
	},
	充值购彩: {
		iconUnicode: '\uE608',
		list: [
			{
				placeholder: '如何进行充值',
				permalink: 'http://www.baidu.com'
			},
			{
				placeholder: '如何购买彩票',
				permalink: 'http://www.baidu.com'
			},
			{
				placeholder: '如何查询购彩记录',
				permalink: 'http://www.baidu.com'
			},
			{
				placeholder: '充值没到账怎么办',
				permalink: 'http://www.baidu.com'
			},
		]
	},
	兑奖提款: {
		iconUnicode: '\uE607',
		list: [
			{
				placeholder: '怎样进行兑奖',
				permalink: 'http://www.baidu.com'
			},
			{
				placeholder: '如何进行提款',
				permalink: 'http://www.baidu.com'
			},
			{
				placeholder: '提款是否收手续费',
				permalink: 'http://www.baidu.com'
			},
			{
				placeholder: '提款不成功怎么办',
				permalink: 'http://www.baidu.com'
			},
		]
	},
	在线客服: {
		iconUnicode: '\uE609',
		list: [
			{
				placeholder: 'QQ咨询：',
				permalink: {
						客服1: 'http://www.baidu.com',
						客服2: 'http://www.baidu.com',
						客服3: 'http://www.baidu.com'
				}
			},
			{
				placeholder: '客服电话：400-636-0000',
				permalink: ''
			},
			{
				placeholder: '在线咨询时间：周一~周日',
				permalink: ''
			},
			{
				placeholder: '电话咨询时间：周一~周五',
				permalink: ''
			},
		]
	}
};
