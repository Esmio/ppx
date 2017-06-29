import React from 'react';
import styles from './index.less';
import {connect} from 'dva';
import Header from '../Header/Header';
import Footer from '../Footer/FooterBar';
import SpecialOfferContent from './SpecialOfferContent'

class SpecialOffer extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		const {promotionList, pcPromotionTopImage, dispatch} = this.props
		let contentProps = {promotionList, pcPromotionTopImage, dispatch};
		return (
		    <div className={styles.normal}>
		    	<Header/>
				<SpecialOfferContent {...contentProps}/>
		      	<Footer/>
		    </div>
		);
	}
}
function mapStateToProps(state){
	const {promotionList, pcPromotionTopImage} = state.specialoffer
	return {promotionList, pcPromotionTopImage}
}

export default connect(mapStateToProps)(SpecialOffer);
