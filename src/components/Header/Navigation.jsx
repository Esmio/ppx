import React, { Component } from 'react';
import { Link } from 'dva/router';
import { connect } from 'dva';
import { PageContainer, SLIcon } from '../General';
import css from '../../styles/header/navigation.less';

class Navigation extends Component {
  constructor() {
    super();
    this.state = {
      isHover: false,
      hoverBgOffset: 0,
      transitionSpeed: 0.25
    };
    this.navWidth = 0;
    this.navItemOffset = [];
  }
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'layoutModel/setActiveTab', payload: '首页' });
  }
  onNavHover(itemName) {
    this.setState({ hoverBgOffset: this.navItemOffset[itemName], isHover: true });
  }
  onNavBlur() {
    this.onNavHover(this.props.activeTab);
    this.setState({ isHover: false });
  }
  setNavWidth(DOM) {
    if (DOM) {
      this.navWidth = DOM.offsetWidth;
    }
  }
  getNavItemOffset(index, DOM) {
    if (DOM) {
      this.navItemOffset[index] = DOM.offsetLeft;
    }
  }
  toggleSideNav() {
    const { dispatch, shouldShowSideNav } = this.props;
    dispatch({ type: 'layoutModel/setSideNavVisibility', payload: !shouldShowSideNav });
  }
  render() {
    const { hoverBgOffset, isHover, transitionSpeed } = this.state;
    const { shouldShowSideNav, sideNavIsLocked } = this.props;
    const timing = isHover
      ? `${transitionSpeed}s`
      : `${transitionSpeed * 4}s`;
    const hoverBgStyle = {
      left: hoverBgOffset,
      transitionDuration: timing,
      WebkitTransitionDuration: timing
    };
    const sideNavParentClass = shouldShowSideNav ?
    css.navigation_sideNavParent__showSideNav : css.navigation_sideNavParent;
    const sideNavToggleIconClass = shouldShowSideNav ?
    css.navigation_sideNavToggleIcon__reverse : css.navigation_sideNavToggleIcon;
    return (
      <div className={css.navigation}>
        <PageContainer className={css.navigation_body}>
          <div className={sideNavParentClass}>
            <button
              className={css.navigation_sideNavToggleBtn}
              disabled={sideNavIsLocked}
              onClick={this.toggleSideNav.bind(this)}
            >
              选择彩种
              {
                !sideNavIsLocked &&
                <SLIcon
                  className={sideNavToggleIconClass}
                  iconName='arrow-down'
                />
              }
            </button>
          </div>
          <div style={hoverBgStyle} className={css.navigation_hoverBg} />
          <div
            className={css.navigation_list}
            ref={DOM => this.setNavWidth(DOM)}
            onMouseLeave={this
            .onNavBlur
            .bind(this)}
          >
            {navList.map((navItem) => {
              const { linkText, url } = navItem;
              return (
                <div
                  className={css.navigation_listItem}
                  ref={DOM => this.getNavItemOffset(linkText, DOM)}
                  key={linkText}
                >
                  <Link to={url}>
                    <button
                      className={css.navigation_button}
                      onMouseEnter={this
                      .onNavHover
                      .bind(this, linkText)}
                    >{linkText}</button>
                  </Link>
                </div>
              );
            })
            }
          </div>
        </PageContainer>
      </div>
    );
  }
}

const mapStatesToProps = ({ layoutModel }) => {
  const { activeTab, shouldShowSideNav, sideNavIsLocked } = layoutModel;
  return { activeTab, shouldShowSideNav, sideNavIsLocked };
};

export default connect(mapStatesToProps)(Navigation);

const navList = [
  { linkText: '首页', url: '/' },
  { linkText: '购彩大厅', url: '/betcenter' },
  { linkText: '手机购彩', url: '/' },
  { linkText: '优惠活动', url: '/specialoffer' },
  { linkText: '开奖公告', url: '/award' },
  { linkText: '走势图表', url: '/trendpage' },
];
