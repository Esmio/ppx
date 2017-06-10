import React, { Component } from 'react';
import { connect } from 'dva';
import { OrangeButton } from '../General/';
import css from '../../styles/header/login.less';

import UserQuickAccessBar from './UserQuickAccessBar';

class Login extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      dropdownIsVisible: false,
      modalIsVisible: false,
      thumbLoaded: false
    };
    this.dispatch = this.props.dispatch.bind(this);
  }
  onAuthModalClick(authenticationState) {
    this.dispatch({ type: 'layoutModel/updateState', payload: { shouldShowAuthModel: true } });
    this.dispatch({ type: 'userModel/updateState', payload: { authenticationState } });
  }
  onShowProfileClick() {
    console.log('onShowProfileClick');
    this.dispatch({
      type: 'layoutModel/updateState',
      payload: { shouldShowProfileModal: true }
    });
  }
  renderAuth() {
    const { userData, shouldShowAuthModel } = this.props;
    if (userData) {
      return (
        <div className={css.login_body}>
          <div className={css.login_QuickAccessRow}>
            <UserQuickAccessBar />
          </div>
        </div>
      );
    } else if (!shouldShowAuthModel) {
      return (
        <div className={css.login_body}>
          <div style={{ float: 'right', marginTop: '0.5rem' }}>
            <OrangeButton
              onClick={this.onAuthModalClick.bind(this, 'LOGIN')}
              placeholder="登录"
              className={css.login_button}
              type="submit"
            />
            <OrangeButton
              onClick={this.onAuthModalClick.bind(this, 'REGISTER')}
              placeholder="注册"
              className={css.login_button}
              type="button"
            />
          </div>
        </div>
      );
    }
    return null;
  }
  render() {
    return this.renderAuth();
  }
}

const mapStatesToProps = ({ userModel, layoutModel }) => {
  const { userData } = userModel;
  const { shouldShowAuthModel } = layoutModel;
  return { userData, shouldShowAuthModel };
};

export default connect(mapStatesToProps)(Login);
