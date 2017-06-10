import React, { Component } from 'react';
import { connect } from 'dva';
import css from '../../styles/User/profile.less';
import Input from './ProfileInput';
import { type as TYPE } from '../../utils/';
import { getValidatePic } from '../../utils/API';
import { OrangeButton, MDIcon, Button, LoadingBar } from '../General/';

class Register extends Component {
	constructor(props) {
		super(props);
		this.dispatch = this.props.dispatch.bind(this);
	}
	
	componentWillMount() {
		this.dispatch({ type: 'formModel/getBrowserUniqueId' });
		this.dispatch({
			type: 'formModel/initializeState',
			payload: [
				'password', 'repeatPassword', 'varifyCode', 'varifyPassed',
				'userAgreed', 'responseMsg',
			]
		});
	}
	componentWillUnmount() {
		this.dispatch({ type: 'userModel/initializeState', payload: ['awaitingResponse'] });
		this.dispatch({
			type: 'formModel/initializeState',
			payload: [
				'username', 'password', 'repeatPassword',
				'varifyCode', 'varifyPassed', 'userAgreed',
				'responseMsg',
			]
		});
	}
	onGestAccountRequest() {
		this.dispatch({
			type: 'formModel/initializeState',
			payload: ['username', 'password', 'repeatPassword', 'varifyCode']
		});
		this.dispatch({ type: 'userModel/postPreRegisterGuest' });
	}
	onSubmitClick() {
		this.dispatch({ type: 'userModel/postRegistration' });
	}
	onLoginClick() {
		this.dispatch({ type: 'userModel/putUserLogin' });
	}
	onReloadClick() {
		this.dispatch({ type: 'formModel/getBrowserUniqueId' });
		this.dispatch({ type: 'formModel/initializeState', payload: ['varifyCode', 'varifyPassed'] });
	}
	onInputChange(event) {
		event.persist();
    const eventTarget = event.target;
    const { value, max, name } = eventTarget;
    const { dispatch } = this.props;
    const payload = { [name]: { value } };
    if (`${value}`.length <= max) {
      dispatch({
        type: 'formModel/updateState', payload
      });
    }
  }
  validateInput(payload) {
    this.dispatch({ type: 'formModel/validateInput', payload });
  }
  validateRepeatInput(payload) {
    this.dispatch({ type: 'formModel/validateRepeatInput', payload });
  }
	validateVarifyCode() {
		this.dispatch({ type: 'formModel/getValidatePic' });
	}
	validateUsername(payload) {
    this.dispatch({ type: 'formModel/getUsernameExistState', payload });
	}
	toggleAgreeCheckbox() {
		this.dispatch({ type: 'userModel/toggleAgree' });
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
	renderUsernameInput() {
		const { username, awaitingResponse } = this.props;
    const { value, inputMsg, icon, color } = username;
		return (
			<Input
				disabled={awaitingResponse}
				dataColor={color}
				dataIcon={icon}
				dataMsg={inputMsg}
				label={`${TYPE.inputFieldRefs.username}`}
				min="6" max="12"
				name="username"
				onBlur={this.validateUsername.bind(this)}
				onChange={this.onInputChange.bind(this)}
				pattern="^[A-Za-z0-9]\w{5,11}$"
				placeholder="请输入字母和数字组成的6-12个字符"
				value={value}
			/>
		);
	}
	renderPasswordInput() {
    const { password, awaitingResponse } = this.props;
    const { value, inputMsg, icon, color } = password;
    return (
      <Input
				disabled={awaitingResponse}
        dataColor={color}
        dataIcon={icon}
        dataMsg={inputMsg}
        label={`${TYPE.inputFieldRefs.password}`}
        min="6" max="12"
        name="password"
        onBlur={this.validateInput.bind(this)}
        onChange={this.onInputChange.bind(this)}
        pattern="^[A-Za-z0-9]\w{5,11}$"
        placeholder="请输入字母和数字组成的6-12个字符"
        type="password"
        value={value}
      />
    );
  }
	renderRepeatPasswordInput() {
    const { repeatPassword, awaitingResponse, authenticationState } = this.props;
		if (authenticationState === 'REGISTER') {
			const { value, inputMsg, icon, color } = repeatPassword;
			return (
				<Input
					disabled={awaitingResponse}
					dataColor={color}
					dataIcon={icon}
					dataMsg={inputMsg}
					label={`${TYPE.inputFieldRefs.repeatPassword}`}
					min="6" max="12"
					name="repeatPassword"
					onBlur={this.validateRepeatInput.bind(this)}
					onChange={this.onInputChange.bind(this)}
					pattern="^[A-Za-z0-9]\w{5,11}$"
					placeholder="请输入字母和数字组成的6-12个字符"
					type="password"
					value={value}
				/>
			);
		} return null;
  }
	renderVarifyPic() {
		const { webUniqueCode, varifyCode, awaitingResponse } = this.props;
    const { value, inputMsg, icon, color } = varifyCode;
		return (
			<div className={css.profile_inputBox}>
				<Input
					disabled={awaitingResponse}
					dataColor={color}
					dataIcon={icon}
					dataMsg={inputMsg}
					label={`${TYPE.inputFieldRefs.varifyCode}`}
					min="6" max="6"
					name="varifyCode"
					onBlur={this.validateVarifyCode.bind(this)}
					onChange={this.onInputChange.bind(this)}
					pattern="^[A-Za-z0-9]\w{6}$"
					placeholder="请输入验证码"
					value={value}
				/>
				<div>
					<img
						className={css.profile_varifyPic}
						src={`${getValidatePic}?webUniqueCode=${webUniqueCode}`}
						alt="验证码"
					/>
					<button
						disabled={awaitingResponse}
						onClick={this.onReloadClick.bind(this)}
						className={css.profile_reloadBtn}
					>
						<MDIcon iconName="reload" /><i>换另一张照片</i>
					</button>
				</div>
			</div>
		);
	}
	renderAgreementCheckbox() {
		const { userAgreed, awaitingResponse, authenticationState } = this.props;
		if (authenticationState === 'LOGIN') return null;
		return (
			<div
				className={css.profile_checkBox}
			>
				<button
					disabled={awaitingResponse}
					onClick={this.toggleAgreeCheckbox.bind(this)}
					className={css.profile_checkBoxLabel}
				>
					<MDIcon
						iconName={userAgreed ? 'checkbox-marked' : 'checkbox-blank'}
						className={css.profile_checkBoxIcon}
					/>
					<span>我已看过并同意</span>
				</button>
				<button
					className={css.profile_agreementBtn}
				>《106彩票合约服务协议》</button>
			</div>
		);
	}
	renderBtnRow() {
		const {
			userAgreed, varifyPassed, password, repeatPassword, username,
			awaitingResponse, authenticationState
		} = this.props;
		let readyToSubmit = false;
		if (authenticationState === 'REGISTER') {
			readyToSubmit = 
				username.value && userAgreed && varifyPassed 
				&& (password.value === repeatPassword.value);
			return (
				<div className={css.profile_formBtnRow}>
					<OrangeButton
						disabled={!readyToSubmit || awaitingResponse}
						className={css.profile_formSubmitBtn}
						onClick={this.onSubmitClick.bind(this)}
						placeholder={`马上${TYPE[authenticationState]}`}
					/>
					<Button
						disabled={awaitingResponse}
						onClick={this.onGestAccountRequest.bind(this)}
						placeholder="免费试玩"
					/>
				</div>
			);
		} else if (authenticationState === 'LOGIN') {
			readyToSubmit = username.value && password.value && varifyPassed;
			return (
				<div className={css.profile_formBtnRow}>
					<OrangeButton
						disabled={!readyToSubmit || awaitingResponse}
						className={css.profile_formSubmitBtn}
						onClick={this.onLoginClick.bind(this)}
						placeholder={`马上${TYPE[authenticationState]}`}
					/>
				</div>
			);
		}
	}
	render() {
		const { awaitingResponse, authenticationState } = this.props;
		
		return (
			<div className={css.profile_contentBody}>
				<h4 className={css.profile_formLabel}>
					用户{TYPE[authenticationState]}
					<LoadingBar duration="2s" isLoading={awaitingResponse} />
				</h4>
				{ this.renderUsernameInput() }
				{ this.renderPasswordInput() }
				{ this.renderRepeatPasswordInput() }
				{ this.renderVarifyPic() }
				{ this.renderAgreementCheckbox() }
				{ this.renderResponseMsg() }
				{ this.renderBtnRow() }
			</div>
		);
	}
}

const mapStatesToProps = ({ userModel, formModel }) => {
	const {
		userAgreed, awaitingResponse, authenticationState
	} = userModel;
	return {
		...formModel, userAgreed, awaitingResponse, authenticationState
	};
};

export default connect(mapStatesToProps)(Register);
