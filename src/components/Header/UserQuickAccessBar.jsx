import React from 'react';
import { SLIcon } from '../General';
import css from '../../styles/header/login.less';

class UserQuickAccessBar extends React.Component {
  state = {
    current: 'mail',
  }

  render() {
    const userInitial = this.props.username.substr(0, 1);
    const backgroundUrl = `https://dummyimage.com/48x48/106ddc/ffffff.png&text=${userInitial}`;

    return (
      <div
        onClick={this.handleClick}
        className={css.quickAccessBar}
      >
        <button key="promotion" className={css.quickAccessBarBtn}>
          <SLIcon iconName="book-open" />交易明细
        </button>
        <button key="report" className={css.quickAccessBarBtn}>
          <SLIcon iconName="pie-chart" />代理报表
        </button>
        <button key="topup" className={css.quickAccessBarBtn}>
          <SLIcon iconName="credit-card" />充值
        </button>
        <button key="logout" className={css.quickAccessBarBtn}>
          <SLIcon iconName="power" />安全登出
        </button>
        <button
          className={css.quickAccessBarBtn}
          onClick={this.props.profileModalTrigger}
        >
          <i
            style={{ backgroundImage: `url(${backgroundUrl})` }}
            className={css.profile_accountUserProfile}  
          />
          <span>{this.props.username}</span>
        </button>
      </div>
    );
  }
}

export default UserQuickAccessBar;
