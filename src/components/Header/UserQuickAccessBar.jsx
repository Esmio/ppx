import React from 'react';
import { connect } from 'dva';
import { Menu, Icon } from 'antd';
import lessVar from '../../styles/variables.less';
import css from '../../styles/header/login.less';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const overwriteAntMenuItem = {
  padding: `0 ${lessVar.size2}`,
  fontSize: lessVar.size2,
  color: lessVar.textBlack,
};

class UserQuickAccessBar extends React.Component {
  constructor(props) {
    super(props);
    this.onProfileModalTrigger = this.onProfileModalTrigger.bind(this);
    this.dispatch = this.props.dispatch.bind(this);
  }
  
  state = {
    current: 'mail',
  }
  onProfileModalTrigger() {
    this.dispatch({ type: 'layoutModel/updateState', payload: { shouldShowProfileModal: true } });
  }
  handleClick = (e) => {
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  }
  render() {
    const userInitial = this.props.username.substr(0, 1);
    const backgroundUrl = `https://dummyimage.com/48x48/106ddc/ffffff.png&text=${userInitial}`;

    return (
      <Menu
        onClick={this.handleClick}
        selectedKeys={[this.state.current]}
        mode="horizontal"
        style={{
          display: 'inline-block',
          borderBottom: 0,
          marginBottom: 0
        }}
      >
        <Menu.Item
          key="account"
          style={{
            ...overwriteAntMenuItem,
            paddingLeft: lessVar.size7
          }}
        >
          <button
            onClick={this.onProfileModalTrigger}
            style={{
              backgroundImage: `url(${backgroundUrl})`,
              position: 'absolute',
              top: '50%',
              left: 0,
              transform: 'translate3d(0, -50%, 0)'
            }}
            className={css.profile_accountUserProfile}
          />
          {this.props.username}
        </Menu.Item>
        <Menu.Item key="balance" style={overwriteAntMenuItem}>
          <Icon type="bank" />1,000
        </Menu.Item>
        <Menu.Item key="app" style={overwriteAntMenuItem}>
          <Icon type="gift" />优惠活动
        </Menu.Item>
        <Menu.Item key="promotion" style={overwriteAntMenuItem}>
          <Icon type="usergroup-add" />代理中心
        </Menu.Item>
        <Menu.Item key="report" style={overwriteAntMenuItem}>
          <Icon type="pie-chart" />盈亏报表
        </Menu.Item>
        <Menu.Item key="transfer" style={overwriteAntMenuItem}>
          <Icon type="wallet" />转帐
        </Menu.Item>
        <Menu.Item key="topup" style={overwriteAntMenuItem}>
          <Icon type="pay-circle" />充值
        </Menu.Item>
        <Menu.Item key="withdraw" style={overwriteAntMenuItem}>
          <Icon type="pay-circle-o" />提款
        </Menu.Item>
        <Menu.Item key="logout" style={overwriteAntMenuItem}>
          <Icon type="poweroff" />安全退出
        </Menu.Item>
      </Menu>
    );
  }
}

const mapStateToProps = ({ userModel }) => {
  const { username } = userModel;
  return { username };
};

export default connect(mapStateToProps)(UserQuickAccessBar);
