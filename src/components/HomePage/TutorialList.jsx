import React from 'react';
import css from '../../styles/homepage/tutorialList.less';
import { Row } from '../General';
import { routerRedux } from 'dva/router';

class TutorialList extends React.Component {
  constructor(props) {
    super(props);
    
  }
  handleLinkClick(id, content){
    const {dispatch} = this.props
    dispatch({type: 'homeInfoModel/updateState', payload: {id, content}})
    dispatch(routerRedux.push({
      pathname: 'helplist'
    }))
  }
  _renderHelpListItem(){
    let {helpListData} = this.props;
    if(!helpListData) return null;
    let arr = []
    helpListData.map((item, index)=>{
      let { cateId, helpList, cateName } = item
      if(cateId===1) arr = helpList
    })  
    let nodes = arr.map((item, index)=>{
      let { id, title, content } = item;
      return <li className={css.tutorial_listItem} key={id}>
        <a className={css.permalink} onClick={this.handleLinkClick.bind(this, id, content)}>{title}</a>
      </li>
    })
    return nodes;
  }
  render() {
    let {dispatch, helpListData} = this.props;
    return (
      <Row className={css.tutorial}>
        <h3 className={css.tutorial_header}>新手指导</h3>
        <ul className={css.tutorial_list}>
          {this._renderHelpListItem()}
        </ul>
      </Row>
    );
  }
}

export default TutorialList;