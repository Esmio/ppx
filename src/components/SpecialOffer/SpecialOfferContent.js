import React, {ReactDOM} from 'react';
import styles from './SpecialOfferContent.less';

class SpecialOfferContent extends React.Component {
	static defaultProps = {
		buttons: ['全部活动', '存款优惠', '返利优惠', '其他优惠'],
		summaryDict: ['ALL','DEPOSIT', 'REFUND', 'OTHERS']
	}
	constructor(props) {
		super(props);
		this.state = {
			buttonIndex : '0',
			show: true,
			curBoxIndex: ''
		}
		this.handleButtonClick = this.handleButtonClick.bind(this);
		this.handleImgClick = this.handleImgClick.bind(this);
	}
	
	handleButtonClick(e){
		while(!e.target.dataset.index){
			e.target = e.target.parentNode;
		}
		let {index} = e.target.dataset;
		this.setState({buttonIndex: index, curBoxIndex: ''})
	}
	handleImgClick(e){
		let {curBoxIndex} = this.state
		while(!e.target.dataset.index){
			e.target = e.target.parentNode
		}
		let {index} = e.target.dataset;
		console.log(index)
		if(index == curBoxIndex) index = ''
		this.setState({curBoxIndex: index})
	}
	_renderLeftNav(){
		let {buttons} = this.props;
		let {buttonIndex} = this.state;
		let nodes = buttons.map((btn, index)=>{
			let color = buttonIndex == index ? '#e4393c' : '',
				backgroundPositionY = buttonIndex == index ? '-71px' : '';
			return <div className={styles.button} key={index} style={{color}} data-index={index} onClick={this.handleButtonClick}>
				<span className={styles.icon} style={{backgroundPositionY}}></span>
				<span className={styles.btnName}>{btn}</span>
				<span className={styles.iconRight}></span>
			</div>
		})
		return <div className={styles.nav}>
			{nodes}
		</div>
	}
	/*
	componentDidUpdate(prevProps, prevState) {
		if(this.state.show === true && prevState.show === false) {
			this.isAnimationTime = setTimeout(()=>{
				ReactDOM.findDOMNode(this).getElementsByClassName("modal")[0].classList.add("in");
			}, 50);
		}
	}
	componentWillReceiveProps(nextProps) {//隐藏的时候执行动画
	    if (this.props.show === true && nextProps.show === false) {
		    this.setState({
		        inOutAnimation: true
		    });
		    ReactDOM.findDOMNode(this).getElementsByClassName("modal")[0].classList.remove("in");
		    this.outAnimationTime = setTimeout(()=> {
		        this.setState({
		        	inOutAnimation: false
		        });
		    }, 300);
	    }
	}
	*/
	_renderSpecialOffers(){
		let {curBoxIndex, buttonIndex} = this.state;
		let {promotionList, dispatch, summaryDict} = this.props;
		if(!promotionList) return null;
		
		let {datas} = promotionList;
		console.log('contddd', promotionList)
		let nodes = datas.map((item, index)=>{
			let {content, createTime, title, photoMobile, summary} = item;
			let isShow = summary === summaryDict[buttonIndex] || summaryDict[buttonIndex] === 'ALL';
			return isShow ? <div className={styles.box} key={title+index}>
				<div className={styles.imgWrap} onClick={this.handleImgClick} data-index={index}>
					<img width="820px" height="215px" style={{overflow: 'hidden'}} src={photoMobile} alt=""/>
				</div>
				<div className={styles.specialOfferInfo} style={{maxHeight: curBoxIndex === index+'' ? '700px' : '0px'}}>
					<div className={styles.infoTitle}>
						<span className={styles.activityTitle}>{title}</span>
						<span className={styles.date}>发布时间：{createTime}</span>
					</div>
					<div className={styles.infoContent}
						dangerouslySetInnerHTML=
    					{{__html: content}}
					>
					</div>
				</div>
			</div> : null
		})
		return nodes;
	}
	render() {
		return (
		    <div className={styles.normal}>
		    	<div className={styles.banner}>
		    		<img width="100%" src="http://ryimg.maya8.cc/activity/2016/06/07/17075053.jpg" alt=""/>
		    	</div>
		    	<div className={styles.content}>
		    		<div>
		    			{this._renderLeftNav()}		    			
		    		</div>
		    		<div>
		    			{this._renderSpecialOffers()}
		    		</div>
		    	</div>
		    </div>
		);
	}
}

export default SpecialOfferContent;
