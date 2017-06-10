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
		const {promotionList, dispatch} = this.props
		let contentProps = {promotionList, dispatch};
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
	const {promotionList} = state.specialoffer
	console.log('props', promotionList);
	return {promotionList}
}

export default connect(mapStateToProps)(SpecialOffer);
