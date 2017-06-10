import React, { Component, cloneElement } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

class ListView extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			childs: null,
			childHeight: 0,
			parentHeight: 0,
			scrollOffset: 0,
			wrapperHeight: null
		};
		this.DOM = null;
		this.parent = null;

		// binding
		this.getChildHeight = this.getChildHeight.bind(this);
		this.getDOM = this.getDOM.bind(this);
		this.getParent = this.getParent.bind(this);
		this.onScrollHandler = this.onScrollHandler.bind(this);
		this.storeChilds = this.storeChilds.bind(this);
	}	
	componentWillMount() {
		this.storeChilds(this.props.renderItem());
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps !== this.props) {
			this.storeChilds(nextProps.renderItem());
		}
	}
	onScrollHandler() {
		if (this.parent) {
			this.setState({
				scrollOffset: this.parent.scrollTop
			});
		}
	}
	getParent(parentDOM) {
		if (parentDOM && this.parent !== parentDOM) {
			this.parent = parentDOM;
		}
		if (this.state.parentHeight !== parentDOM.offsetHeight) {
			this.setState({
				parentHeight: parentDOM.offsetHeight
			});
		}
	}
	getChildHeight(childDOM) {
		const { childs, childHeight, wrapperHeight } = this.state;
		if (childDOM && childHeight !== childDOM.offsetHeight) {		
			this.setState({
				childHeight: childDOM.offsetHeight,
				wrapperHeight: childHeight * childs.length
			});
		} else if (childs && childHeight && wrapperHeight !== childs.length * childHeight) {
			this.setState({
				wrapperHeight: childs.length * childHeight
			});
		}
	}
	getChild(childs) {
		if (childs && childs.length) {
			this.getChildHeight(childs[0]);
		}
	}
	getDOM(DOM) {
		if (DOM) {
			this.DOM = DOM;	
			this.getParent(DOM.parentElement);
			this.getChild(DOM.children);
		}
	}
	storeChilds(childList) {
		if (childList) {
			// console.log('storing child', childList);
			this.setState({ 
				childs: childList
			});
		}
	}
	transformChild(child, index) {
		const { childHeight, scrollOffset } = this.state;
		const offset = (childHeight * index) + scrollOffset;
		const transform = `translate3d(0, ${offset}px, 0)`;
		const newStyles = Object.assign(
			{},
			child.props.style,
			{
				position: 'absolute',
				width: '100%',
				transform
			}
		);
		return cloneElement(child, { style: newStyles });
	}
	sliceChilds(childs) {
		const { scrollOffset, childHeight, parentHeight } = this.state;
		const itemToShow = Math.ceil(parentHeight / childHeight);
		const scrolledItem = scrollOffset / childHeight;
		if (childs.length && !isNaN(scrolledItem)) {
			const start = 0 + Math.floor(scrolledItem);
			const end = itemToShow + Math.ceil(scrolledItem);

			return _.slice(childs, start, end);
		}
		return childs;
	}
	renderScene() {
		const { childs, scrollOffset } = this.state;
		const { container } = ListViewStyle;
		const containerStyle = Object.assign(
			{}, 
			container, 
			this.state.wrapperHeight ? { height: this.state.wrapperHeight } : {},
			{
				transform: `translate3d(0, -${scrollOffset}px, 0)`
			},
		);
		if (childs) {
			const newChildList = childs.map((child, index) => {
				return this.transformChild(child, index); 
			});
			return (
				<div ref={DOM => this.getDOM(DOM)} style={containerStyle}>
					{ this.sliceChilds(newChildList) }
				</div>
			);
		}
		
		return null;
	}

	render() {
		const { outerContainer } = ListViewStyle;
		return (
			<div style={outerContainer} onScroll={this.onScrollHandler}>
				{ this.renderScene() }	
			</div>
		);
	}
}

ListView.propTypes = {
	renderItem: PropTypes.func.isRequired
};

export { ListView };

const ListViewStyle = {
	outerContainer: {
		height: '100%',
		overflowY: 'scroll',
		maxHeight: '100%',
		position: 'relative'
	},
	container: {
		display: 'block',
	},
};
