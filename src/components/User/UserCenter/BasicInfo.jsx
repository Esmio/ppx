import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { type as TYPE } from '../../../utils';
import { MDIcon, LoadingBar } from '../../General';
import Input from '../ProfileInput';
import css from '../styles/ProfileIndex.less';

const { dateFormat } = TYPE;

class BasicInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formIsPristine: true,
      editTarget: ''
    };
    this.onCancelClick = this.onCancelClick.bind(this);
    this.dispatch = this.props.dispatch.bind(this);
  }
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'formModel/getBasicDetails' });
    dispatch({ type: 'userModel/getMyLoginHistory' });
  }
  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props;
    if (nextProps.userProfileSelectedNav !== this.props.userProfileSelectedNav) {
      dispatch({ type: 'formModel/getBasicDetails' });
    }
    if (
      nextProps.responseMsg !== this.props.responseMsg &&
      nextProps.responseMsg.msg === '信息绑定'
    ) {
      this.setState({ editTarget: '' });
      dispatch({ type: 'formModel/getBasicDetails' });
    }
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'formModel/initializeState',
      payload: [
        'nickname', 'realName', 'phoneNumber', 'email', 'responseMsg', 'username', 'prizeGroup'
      ]
    });
  }
  onCancelClick(target) {
    this.setState({ editTarget: '' });
    this.dispatch({ type: 'formModel/initializeState', payload: [target] });
  }
  onEditTarget(editTarget) {
    this.setState({ editTarget });
  }
  onInputChange(event) {
    const eventTarget = event.target;
    const { value, max, name } = eventTarget;
    const { dispatch } = this.props;
    const payload = { [name]: { value } };
    if (`${value}`.length <= max) {
      dispatch({
        type: 'formModel/updateState', payload
      });
      dispatch({ type: 'formModel/initializeState', payload: ['responseMsg'] });
    }
    this.setState({ formIsPristine: false });
  }
  onSubmitClick() {
    const { dispatch } = this.props;
    dispatch({ type: 'userModel/putUserInfo' });
  }
  validateInput(payload) {
    const { dispatch } = this.props;
    dispatch({
      type: 'formModel/validateInput', payload
    });
  }
  renderResponseMsg() {
    const { responseMsg } = this.props;
    const { msg, color, icon } = responseMsg;
    if (msg) {
      return (
        <div
          style={{ backgroundColor: color }}
          className={css.profile_formResponse}
        >
          <MDIcon iconName={icon} />
          <span>{ msg }</span>
        </div>
      );
    } return null;
  }
  renderNickname() {
    const { nickname } = this.props;
    const { editTarget } = this.state;
    const { value, inputMsg, icon, color } = nickname;
    return (
      <div className={css.profile_inputInlineRow}>
        {
          editTarget === 'nickname' || value ?
          <div className={css.profile_inputInlineBlock}>
            <Input
              readOnly={editTarget !== 'nickname'}
              dataColor={color}
              dataIcon={icon}
              dataMsg={inputMsg}
              label={`${TYPE.inputFieldRefs.nickname}`}
              min="2" max="10"
              name="nickname"
              onBlur={this.validateInput.bind(this)}
              onChange={this.onInputChange.bind(this)}
              pattern="[^\u0000-\u00FF]{2,10}$"
              placeholder="请输入 2-10 位中文字符"
              value={value}
            />
          </div> : null
        }
        { editTarget === 'nickname' ?
            <button
              onClick={this.onCancelClick.bind(this, 'nickname')}
              className={css.profile_inputInlineBtn}
            >取消</button> : null
          }
        {
          editTarget === 'nickname' ?
          <button
            disabled={!value}
            onClick={this.onSubmitClick.bind(this)}
            className={css.profile_inputInlineBtn}
          >确定绑定</button> :
          <button
            disabled={value}
            onClick={this.onEditTarget.bind(this, 'nickname')}
            className={css.profile_inputInlineBtn}
          >{value ? '已绑定' : `绑定${TYPE.inputFieldRefs.nickname}`}</button>
        }
      </div>
    );
  }
  renderRealName() {
    const { realName } = this.props;
    const { editTarget } = this.state;    
    const { value, inputMsg, icon, color } = realName;
    if (value) {
      return (
        <div className={css.profile_inputInlineRow}>
          {
            editTarget === 'realName' || value ?
            <div className={css.profile_inputInlineBlock}>
              <Input
                readOnly={editTarget !== 'realName'}
                dataColor={color}
                dataIcon={icon}
                dataMsg={inputMsg}
                label={`${TYPE.inputFieldRefs.realName}`}
                min="2" max="10"
                name="realName"
                onBlur={this.validateInput.bind(this)}
                onChange={this.onInputChange.bind(this)}
                pattern="[^\u0000-\u00FF]{2,10}$"
                placeholder="请输入 2-10 位中文字符"
                value={value}
              />
            </div> : null
          }
          { editTarget === 'realName' ?
            <button
              onClick={this.onCancelClick.bind(this, 'realName')}
              className={css.profile_inputInlineBtn}
            >取消</button> : null
          }
          {
            editTarget === 'realName' ?
            <button
              disabled={!value}
              onClick={this.onSubmitClick.bind(this)}
              className={css.profile_inputInlineBtn}
            >确定绑定</button> :
            <button
              disabled={value}
              onClick={this.onEditTarget.bind(this, 'realName')}
              className={css.profile_inputInlineBtn}
            >{value ? '已绑定' : `绑定${TYPE.inputFieldRefs.realName}`}</button>
          }
        </div>
      );
    }
    return null;
  }
  renderPhoneNumber() {
    const { phoneNumber } = this.props;
    const { editTarget } = this.state;    
    const { value, inputMsg, icon, color } = phoneNumber;
    return (
      <div className={css.profile_inputInlineRow}>
        {
          editTarget === 'phoneNumber' || value ?
          <div className={css.profile_inputInlineBlock}>
            <Input
              readOnly={editTarget !== 'phoneNumber'}
              dataColor={color}            
              dataIcon={icon}
              dataMsg={inputMsg}
              label={`${TYPE.inputFieldRefs.phoneNumber}`}
              max="11" min="11"
              name="phoneNumber"
              onBlur={this.validateInput.bind(this)}
              onChange={this.onInputChange.bind(this)}
              pattern="^[1-3][1-3][0-9]"
              placeholder="请输入正确11位数字电话号码"
              value={value}
            />
          </div> : null
        }
        { editTarget === 'phoneNumber' ?
          <button
            onClick={this.onCancelClick.bind(this, 'phoneNumber')}
            className={css.profile_inputInlineBtn}
          >取消</button> : null
        }
        {
          editTarget === 'phoneNumber' ?
          <button
            disabled={!value}
            onClick={this.onSubmitClick.bind(this)}
            className={css.profile_inputInlineBtn}
          >确定绑定</button> :
          <button
            disabled={value}
            onClick={this.onEditTarget.bind(this, 'phoneNumber')}
            className={css.profile_inputInlineBtn}
          >{value ? '已绑定' : `绑定${TYPE.inputFieldRefs.phoneNumber}`}</button>
        }
      </div>
    );
  }
  renderEmail() {
    const { email } = this.props;
    const { editTarget } = this.state;    
    const { value, inputMsg, icon, color } = email;
    return (
      <div className={css.profile_inputInlineRow}>
        {
          editTarget === 'email' || value ?
          <div className={css.profile_inputInlineBlock}>
            <Input
              readOnly={editTarget !== 'email'}
              dataColor={color}
              dataIcon={icon}
              dataMsg={inputMsg}
              label={`${TYPE.inputFieldRefs.email}`}
              max="35" min="7"
              name="email"
              onBlur={this.validateInput.bind(this)}
              onChange={this.onInputChange.bind(this)}
              pattern="^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$"
              placeholder="请输入正确的邮箱地址例如:example@qq.com"
              value={value}
            />
          </div> : null
        }
        { editTarget === 'email' ?
            <button
              onClick={this.onCancelClick.bind(this, 'email')}
              className={css.profile_inputInlineBtn}
            >取消</button> : null
          }
        {
          editTarget === 'email' ?
          <button
            disabled={!value}
            onClick={this.onSubmitClick.bind(this)}
            className={css.profile_inputInlineBtn}
          >确定绑定</button> :
          <button
            disabled={value}
            onClick={this.onEditTarget.bind(this, 'email')}
            className={css.profile_inputInlineBtn}
          >{value ? '已绑定' : `绑定${TYPE.inputFieldRefs.email}`}</button>
        }
      </div>
    );
  }
  rendermyLoginHistory() {
    const { myLoginHistory } = this.props;
    return (
      _.map(myLoginHistory, (history) => {
        const { loginTime, location } = history;
        return (
          <tr key={loginTime}>
            <td>
              { moment(loginTime).format(dateFormat) }
            </td>
            <td>
              { location }
            </td>
          </tr>
        );
      })
    );
  }
  render() {
    const { userData } = this.props;
    const { username, currentSignInAt } = userData;
    const userInitial = `${username}`.substring(0, 1);
    const signInTime = moment(currentSignInAt).format('hh:mm:ss, Do MMM Y');
    const backgroundUrl = `https://dummyimage.com/48x48/106ddc/ffffff.png&text=${userInitial}`;
    return (
      <div>
        <div className={css.profile_contentBody}>
          <div className={css.profile_accountProfileRow} style={{ marginBottom: '1rem' }}>
            <button
              style={{ backgroundImage: `url(${backgroundUrl})` }}
              className={css.profile_accountUserProfile}
            />
            <div className={css.profile_accountProfileInfo}>
              <p>{ username }</p>
              <p className={css.profile_accountProfileLoginTime}>最后登录 { signInTime }</p>
            </div>
          </div>
          <h4 className={css.profile_formLabel}>基本信息</h4>
          <LoadingBar />
          { this.renderResponseMsg() }
          <div className={css.profile_accountProfileRow}>
            { this.renderRealName() }
            { this.renderNickname() }
            { this.renderPhoneNumber() }
            { this.renderEmail() }
          </div>
        </div>
        <div className={css.profile_contentBody}>
          <h4 className={css.profile_formLabel}>登录历史</h4>
          <LoadingBar />
          <table className={css.profile_table}>
            <thead>
              <tr>
                <td>登录时间</td>
                <td>登录地区</td>
              </tr>
            </thead>
            <tbody>
              { this.rendermyLoginHistory() }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const mapStatesToProps = ({ userModel, formModel, layoutModel }) => {
  const { shouldShowProfileModal } = layoutModel;
  const { userData, myLoginHistory } = userModel;
  return { userData, myLoginHistory, shouldShowProfileModal, ...formModel };
};

export default connect(mapStatesToProps)(BasicInfo);
