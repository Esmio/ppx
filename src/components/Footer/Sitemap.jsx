import React from 'react';
import { PageContainer, Row, Column, MDIcon } from '../General';
import css from '../../styles/footer/sitemap.less';
import logo106 from '../../assets/image/logo.png';
import { connect } from 'dva';
import {routerRedux} from 'dva/router';

class Sitemap extends React.Component{
	constructor(props) {
		super(props);
		
	}
	static defaultProps = {
		dict : {
			"账户安全" : "\uE60A",
			"购彩问题" : "\uE608",
			"充提问题" : "\uE607",
			"在线客服" : "\uE609"
		},
		customerService : {
			cateName: "在线客服",
			helpList: [
				{
					title: 'QQ咨询：',
					cateId: {
							客服1: 'http://www.baidu.com',
							客服2: 'http://www.baidu.com',
							客服3: 'http://www.baidu.com'
					}
				},
				{
					title: '客服电话：400-636-0000',
					cateId: ''
				},
				{
					title: '在线咨询时间：周一~周日',
					cateId: ''
				},
				{
					title: '电话咨询时间：周一~周五',
					cateId: ''
				},
			]
		}
	}
	renderIcon(hexcode) {
		return <span className={css.sitemap_labelIcon}>{hexcode}</span>;
	}
	
	handleHelpListItemClick(id, content){
		let {dispatch} = this.props
		console.log('dispatch', dispatch)
		dispatch({type: 'homeInfoModel/updateState', payload:{id, content}})
		dispatch(routerRedux.push({
			pathname: 'helplist'
		}))
	}

	renderListItem(title, list, id, content) {
		const isLink = list && typeof list === 'string';
		const linkEmpty = list === '';
		if (isLink && !linkEmpty) {
			return (
				<li className={css.sitemap_listItem} key={title + id}>
					<a className={css.sitemap_permalink} onClick={this.handleHelpListItemClick.bind(this, id, content)}>{ title } </a>
				</li>
			);
		} else if (linkEmpty) {
			return <li className={css.sitemap_listItem} key={title}>{ title }</li>;
		} else if (typeof list === 'object') {
			const links = [];

			for (const innerPlaceholder in list) {
				if (list[innerPlaceholder]) {
					const inlinePermalink = list[innerPlaceholder];
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
			return <li className={css.sitemap_listItem} key={title}>{title}{links}</li>;
		}
		
		return null;
	}

	renderList(label, list) {
		if (label && list) {
			const mapList = [];
			for (const listItem in list) {
				if (list[listItem]) {
					const { title, cateId, id, content } = list[listItem];
					mapList.push(
						this.renderListItem(title, cateId, id, content)
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

	renderSitemap() {
		let {helpListData, dict, customerService} = this.props
		if (helpListData) {
			const sitemaps = [];	
			helpListData = helpListData.concat(customerService)	
			helpListData.map((item, index) => {
				let { cateName, helpList } = item;
				let iconUnicode = dict[cateName]
				if(dict[cateName]) {
					sitemaps.push(
						<Column className={css.sitemap_column} key={cateName} >
							<div className={css.sitemap_columnBody}>
								<Column>
									{ this.renderIcon(iconUnicode) }
								</Column>
								{ this.renderList(cateName, helpList) }
							</div>
						</Column>
					);
				}
			})
			return (
				<Row>
					{ sitemaps }
				</Row>
			);
		}

		return null;
	}

	render() {
		return <Row className={css.sitemap}>
			<PageContainer className={css.sitemap_body}>
				<Column width="25%">
					<img src={logo106} alt="106 彩票" />
					<Row className={css.sitemap_benefits}>
						<p className={css.sitemap_benefit}>
							<MDIcon iconName="checkbox-marked" className={css.sitemap_checkbox} />
							账户安全
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
					{ this.renderSitemap() }
				</Column>
			</PageContainer>
		</Row>
	}
}

const sitemapData2 = {
	"账户安全": {
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
	"购彩问题": {
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
	"充提问题": {
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

function mapStateToProps({homeInfoModel}){
	const {helpListData} = homeInfoModel
	return {helpListData}
}


export default connect(mapStateToProps)(Sitemap);