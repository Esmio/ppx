import React from 'react';
import styles from './PageContent.less';
import {routerRedux} from 'dva/router';
import {hasTrendChart} from '../../utils';

class PageContent extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			buttonIndex: '-1'
		}
		this.handleButtonClick = this.handleButtonClick.bind(this)
		this.handleLottoClick = this.handleLottoClick.bind(this)
	}
	static defaultProps = {
		buttons : ['全部彩种', '时时彩', '快三', '十一选5', '低频'],
		buttonsItems :{ 
			HF_AHD11:"安徽11选5",
			HF_AHK3:"安徽快3",
			HF_BJPK10:"北京PK10",
			HF_CQKL10F:"重庆快乐10分",
			HF_CQSSC:"重庆时时彩",
			HF_GDD11:"广东11选5",
			HF_GDKL10F:"广东快乐10分",
			HF_GXK3:"广西快3",
			HF_JSK3:"江苏快3",
			HF_JXD11:"江西11选5",
			HF_LF28:"幸运28",
			HF_LFKLPK:"幸运扑克",
			HF_LFPK10:"二分PK10",
			HF_LFSSC:"二分时时彩",
			HF_SDD11:"山东11选5",
			HF_SG28:"新加坡28",
			HF_SHD11:"上海11选5",
			HF_SHSSL:"上海时时乐",
			HF_TJKL10F:"天津快乐10分",
			HF_TJSSC:"天津时时彩",
			HF_XJSSC:"新疆时时彩",
			MARK_SIX:"香港6合彩",
			PL3:"排列3",
			PL5:"排列5",
			UNRECOGNIZED:"PC蛋蛋",
			X3D:"福彩3D"
		},
		buttonsClasses: [
			['HF_CQSSC', 'HF_LFPK10', 'HF_LFSSC', 'HF_SHSSL', 'HF_TJSSC', 'HF_XJSSC'],
			['HF_AHK3', 'HF_GXK3', 'HF_JSK3'],
			['HF_AHD11', 'HF_GDD11', 'HF_JXD11', 'HF_SDD11'],
			['MARK_SIX', 'X3D', 'PL3'],
			['HF_LF28', 'HF_SG28', 'UNRECOGNIZED'],
			['HF_CQKL10F', 'HF_GDKL10F', 'HF_TJKL10F']
		]
	}
	handleButtonClick(e){
		let {index} = e.target.dataset
		this.setState({buttonIndex: index})
	}
	handleLottoClick(e) {
		const {dispatch} = this.props
		while(!e.target.dataset.id){
			e.target = e.target.parentNode
		}
		let {id} = e.target.dataset
		if(!hasTrendChart(id)) return false
		console.log('id', id);
		dispatch(routerRedux.push({
			pathname: 'trend',
			query: {
				gameUniqueId: id
			}
		}))
	}
	LotteryDict(){
		let lotteryIconStr = localStorage.getItem('lotteryIconStr');
		let lotteryIcon = JSON.parse(lotteryIconStr)
		let lotteryNameStr = localStorage.getItem('lotteryNameStr');
		let lotteryName = JSON.parse(lotteryNameStr)
		let lotteryIconGrayStr = localStorage.getItem('lotteryIconGrayStr');
		let lotteryIconGray = JSON.parse(lotteryIconGrayStr)
		
		return {lotteryIcon, lotteryName, lotteryIconGray}
	}
	_renderButtons(){
		let {buttons} = this.props
		let {buttonIndex} = this.state
		let buttonStyle = {borderBottom: '2px solid red', color: 'red'}
		let nodes = buttons.map((btn, index)=>{
			let style = buttonIndex == index-1 ? buttonStyle : null
			return <div className={styles.button} data-index={index-1} key={index} style={style} onClick={this.handleButtonClick}>{btn}</div>
		})
		return nodes
	}
	//  render buttons
	_renderCategoryClasses(){
		let {buttonsClasses} = this.props;
		let {buttonIndex} = this.state;
		let curButtons = buttonsClasses[buttonIndex];
		let {lotteryName} = this.LotteryDict();
		if(buttonIndex==='-1'){
			curButtons = []
			buttonsClasses.map((arr, index)=>{
			   curButtons = curButtons.concat(arr)
			})
		}
		let nodes = curButtons.map((id, index)=>{
			let backgroundColor = hasTrendChart(id) ? '' : '#ccc'
			return hasTrendChart(id) ? <button className={styles.lotto} key={id} data-id={id} disabled={!hasTrendChart(id)} style={{backgroundColor}} onClick={this.handleLottoClick}>{lotteryName[id]}</button> : null
		})
		return nodes
	}
	_renderSelectNav(){
		return <div className={styles.headerSelect}>
			<div className={styles.nav}>{this._renderButtons()}</div>
			<div className={styles.content}>{this._renderCategoryClasses()}</div>
		</div>
	}
	// 有icon区块
	_renderIconButtons(i){
		let {buttonsClasses} = this.props;
		let {lotteryName, lotteryIcon, lotteryIconGray} = this.LotteryDict();
		let curLotto = buttonsClasses[i];
		let nodes = curLotto.map((id, index)=>{
			let icon = hasTrendChart(id) ? lotteryIcon[id] : lotteryIconGray[id]
			return hasTrendChart(id) ? <div className={styles.iconItem} key={id} data-id={id} onClick={this.handleLottoClick}>
				<img className={styles.icon} src={icon} alt={lotteryName[id]}/>
				<span className={styles.iconName} style={{color: hasTrendChart(id) ? '' : '#aaa'}}>{lotteryName[id]}</span>
			</div> : null
		})
		return nodes
	}
	_renderWithIconBox(){
		let {buttons} = this.props;
		buttons = buttons.slice(-(buttons.length-1))
		let nodes = buttons.map((title, index)=>{
			return <div className={styles.box} key={index}>
				<div className={styles.title}>{title}</div>
				<div className={styles.iconContainer}>
					{this._renderIconButtons(index)}
				</div>
			</div>
		})
		return nodes		
	}
	render() {
		return (
		    <div className={styles.normal}>
		      	{this._renderSelectNav()}
		      	{this._renderWithIconBox()}
		    </div>
		)
	}
}

export default PageContent;
