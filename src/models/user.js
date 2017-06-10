import { message } from 'antd';
import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { type as TYPE } from '../utils';
import { apiRequest as request, validate } from '../services';
import { accentCinnabar, accentTeal } from '../styles/variables.less';

const INITIAL_STATE = {
  accessToken: null,
  awaitingResponse: false,
  authenticationState: 'REGISTER',
  bankAccounts: [],
  banksOptions: TYPE.banksOptions,
  cardIsDefault: false,
  dailyWithdrawWithAdminSettingsResult: '',
  generatedVarifyCode: '',
  loginHistory: [],
  password: '',
  passwordInputMsg: '',
  selectedBankCardId: '',
  userAgreed: true,
  userData: null,
  userIdExist: null,
  username: '',
  usernameInputMsg: '',
};

export default {
	namespace: 'userModel',
	state: INITIAL_STATE,
	reducers: {
    getAccessTokenSuccess(state, { payload }) {
      return { ...state, accessToken: payload };
    },
    getUserIdSuccess(state, { payload }) {
      const { data } = payload;
      let msg = '';
      msg = data.checkState ? '用户名存在' : `${TYPE.title}，该用户名不存在哟~`;
      return { ...state,
        passwordInputMsg: '',
        userIdExist: data.checkState,
        usernameInputMsg: {
          icon: 'checkbox-marked-circle-outline',
          color: accentTeal,
          message: msg
        },
      };
    },
    getCardsAndWithdrawDetailSuccess(state, { payload }) {
      return { ...state, ...payload };
    },
    getCurrentUserSuccess(state, { payload }) {
      const {
        nickname, realName, username, qq, email, phoneNumber, identityNumber
      } = payload;

      return { ...state,
        email,
        identityNumber,
        nickname,
        password: '',
        passwordInputMsg: '',
        phoneNumber,
        qq,
        realName,
        userData: payload,
        userIdExist: null,
        username,
        usernameInputMsg: '',
      };
    },
    getCurrentUserFailed() {
      localStorage.removeItem(TYPE.accessToken);
      message.warning(`${TYPE.title}, 登陆过时，请重新登陆`);
      return { ...INITIAL_STATE };
    },
    getUserLogoutSuccess() {
      localStorage.removeItem(TYPE.accessToken);
      return { ...INITIAL_STATE };
    },
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
    updateInfoSuccess(state, { payload }) {
      const { target } = payload;
      return { ...state,
        [`${target}InfosFormResponse`]: {
          icon: 'checkbox-marked-circle-outline',
          color: accentTeal,
          message: `${TYPE[target]}信息更新成功`
        }
      };
    },
    updateInfoFailed(state, { payload }) {
      const { target } = payload;
      return { ...state,
        [`${target}InfosFormResponse`]: {
          icon: 'close-circle-outline',
          color: accentCinnabar,
          message: payload.message
        }
      };
    },
    initializeState(state, { payload }) {
      const initialState = _.pick(INITIAL_STATE, payload);
      return { ...state, ...initialState };
    },
    toggleAgree(state) {
      const { userAgreed } = state;
      return { ...state, userAgreed: !userAgreed };
    },
    toggleAccountInfoTarget(state, { payload }) {
      return { ...state,
        accountInfoEditTarget: payload,
        withdrawalInfosFormResponse: INITIAL_STATE.withdrawalInfosFormResponse,
        accountInfosFormResponse: INITIAL_STATE.accountInfosFormResponse
      };
    },
    validateInputPassed(state, { payload }) {
      const { name, inputMessage } = payload;
      const result = {
        icon: 'checkbox-marked-circle-outline',
        color: accentTeal,
        message: inputMessage
      };
      return { ...state, [`${name}InputMsg`]: result, [`${name}ValidatePassed`]: true };
    },
    validateInputFailed(state, { payload }) {
      const { name, inputMessage } = payload;
      const result = {
        icon: 'close-circle-outline',
        color: accentCinnabar,
        message: inputMessage
      };
      return { ...state, [`${name}InputMsg`]: result, [`${name}ValidatePassed`]: false };
    }
  },
	effects: {
    *getUserId({ payload }, { call, put }) {
      const response = yield call(validate.checkUserId, payload);
      const { data, err } = response;
      if (data) {
        yield put({ type: 'getUserIdSuccess', payload: response });
      } else if (!err && !data) {
        console.log('查询用户名', payload);
      }
    },
    *getLoginHistory({ payload }, { call, put, select }) {
      const { userModel } = yield select(state => state);
      const response = yield call(request.getLoginHistory, userModel);
      const { data, err } = response;
      if (data) {
        yield put({ type: 'updateState', payload: { loginHistory: data.datas } });
      } else if (err) {
        console.log('无法获取登陆历史', err.message);
      }
    },
    *getUserLogout({ payload }, { call, put, select }) {
      const { accessToken } = yield select(state => state.userModel);
      const response = yield call(request.getUserLogout, accessToken);
      const { err, data } = response;
      if (data) {
        yield put({ type: 'getUserLogoutSuccess' });
        yield put(routerRedux.replace('/'));
      } else if (err) {
        message.error(`用户登出 ${err.message}`);
      } else if (!err && !data) {
        console.log('用户登出 payload', payload);
      }
    },
    *getAccessToken({ payload }, { put }) {
      const accessToken = yield localStorage.getItem(TYPE.accessToken);
      if (accessToken) {
        yield put({ type: 'getAccessTokenSuccess', payload: accessToken });
        yield put({ type: 'getCurrentUser' });
      }
    },
    *getCurrentUser({ payload }, { call, put, select }) {
      const { accessToken } = yield select(state => state.userModel);
      const response = yield call(request.getCurrentUser, accessToken);
      const { err, data } = response;
      if (data) {
        yield put({
          type: 'getCurrentUserSuccess',
          payload: data
        });
      } else {
        yield put({
          type: 'getCurrentUserFailed',
          payload: err.message
        });
      }
    },
    *getCardsAndWithdrawDetail({ payload }, { call, put, select }) {
      const { userModel } = yield select(state => state);
      const response = yield call(request.getCardsAndWithdrawDetail, userModel);
      const { err, data } = response;
      if (data) {
        yield put({
          type: 'getCardsAndWithdrawDetailSuccess',
          payload: data
        });
      } else {
        throw new Error(`无法获取银行卡信息, ${err}`);
      }
    },
    *putUserLogin({ payload }, { call, put, select }) {
      yield put({ type: 'updateState', payload: { awaitingResponse: true } });      
      const { formModel } = yield select(state => state);
      const response = yield call(request.putUserLogin, formModel);
      const { err, data } = response;
      if (data) {
        const accessToken = data.oauthToken.access_token;
        yield localStorage.setItem(TYPE.accessToken, accessToken);
        yield put({ type: 'getAccessTokenSuccess', payload: accessToken });
        yield put({ type: 'getCurrentUser' });
        yield put({
          type: 'formModel/initializeState', payload: ['username', 'password', 'varifyCode']
        });
        yield put({ type: 'updateState', payload: { awaitingResponse: false } });        
        yield put({
          type: 'layoutModel/updateState', payload: { shouldShowAuthModel: false }
        });
      } else if (err) {
        yield put({
          type: 'formModel/updateState',
          payload: {
            responseMsg: {
              msg: err.message, icon: 'checkbox-marked-circle-outline', color: accentCinnabar
            }
          }
        });
        yield put({ type: 'updateState', payload: { awaitingResponse: false } });
      }
    },
    *putUserInfo({ payload }, { call, put, select }) {
      const { userModel, formModel } = yield select(state => state);
      const response = yield call(request.putUserInfo, userModel, formModel);
      const { err } = response;
      if (err) {
        yield put({
          type: 'formModel/updateState',
          payload: {
            responseMsg: {
              msg: err.message, icon: 'checkbox-marked-circle-outline', color: accentCinnabar
            }
          }
        });
      } else {
        yield put({
          type: 'formModel/updateState',
          payload: {
            responseMsg: {
              msg: '信息绑定', icon: 'checkbox-marked-circle-outline', color: accentTeal
            }
          }
        });
        yield put({ type: 'getCurrentUser' });
      }
    },
    *putRegisterInfo({ payload }, { call, put, select }) {    
      const { formModel, userModel } = yield select(state => state);
      const response = yield call(request.putRegisterInfo, userModel, formModel);
      const { err } = response;
      if (err) {
        yield put({
          type: 'formModel/updateState',
          payload: {
            responseMsg: {
              msg: err.message, icon: 'checkbox-marked-circle-outline', color: accentCinnabar
            }
          }
        });
      } else {
        yield put({
          type: 'formModel/updateState',
          payload: {
            responseMsg: {
              msg: '添加银行卡成功', icon: 'checkbox-marked-circle-outline', color: accentTeal
            }
          }
        });
        yield put({ type: 'getCurrentUser' });
        yield put({ type: 'getCardsAndWithdrawDetail' });
        yield put({
          type: 'formModel/initializeState',
          payload: ['bankName', 'bankCode', 'bankAddress', 'bankCardNo', 'remarks']
        });
      }
    },
    *putDefaultBankAccount({ payload }, { call, put, select }) {
      const userModel = yield select(state => state.userModel);
      const response = yield call(request.putDefaultBankAccount, userModel);
      const { err } = response;
      if (!err) {
        yield put({
          type: 'formModel/updateState',
          payload: {
            responseMsg: {
              msg: '默认银行卡设定成功', icon: 'checkbox-marked-circle-outline', color: accentTeal
            }
          }
        });
        yield put({ type: 'getCardsAndWithdrawDetail' });
      } else {
        throw new Error(err.message);
      }
    },
    *postBankInfo({ payload }, { call, put, select }) {
      const { userModel, formModel } = yield select(state => state);
      const response = yield call(request.postBankInfo, userModel, formModel);
      const { err } = response;
      if (err) {
        yield put({
          type: 'formModel/updateState',
          payload: {
            responseMsg: {
              msg: err.message, icon: 'checkbox-marked-circle-outline', color: accentCinnabar
            }
          }
        });
      } else {
        yield put({
          type: 'formModel/updateState',
          payload: {
            responseMsg: {
              msg: '添加银行卡成功', icon: 'checkbox-marked-circle-outline', color: accentTeal
            }
          }
        });
        yield put({ type: 'getCardsAndWithdrawDetail' });
        yield put({
          type: 'formModel/initializeState',
          payload: ['bankName', 'bankCode', 'bankAddress', 'bankCardNo', 'remarks']
        });
      }
    },
    *postPreRegisterGuest({ payload }, { call, put }) {
      yield put({ type: 'updateState', payload: { awaitingResponse: true } });
      const response = yield call(request.postPreRegisterGuest);
      const { data, err } = response;
      if (data) {
        const password = moment(new Date()).format('DDMMYYhhmm');
        yield put({
          type: 'formModel/updateState',
          payload: {
            username: { value: data.username },
            password: { value: password },
            repeatPassword: { value: password },  
          }
        });
        yield put({ type: 'postGuestRegistration' });
      } else if (err) {
        yield put({ type: 'updateState', payload: { awaitingResponse: false } });
        yield put({
          type: 'formModel/updateState',
          payload: {
            responseMsg: {
              msg: err.message, icon: 'checkbox-marked-circle-outline', color: accentCinnabar
            }
          }
        });
      }
    },
    *postGuestRegistration({ payload }, { call, put, select }) {
      const { formModel } = yield select(state => state);
      const response = yield call(request.postGuestRegistration, formModel);
      const { password } = formModel;
      const { err, data } = response;
      if (data) {
        yield put({
          type: 'formModel/updateState',
          payload: {
            responseMsg: {
              msg: ['试玩账号注册成功，密码暂为: ', <strong>{password.value}</strong>],
              icon: 'checkbox-marked-circle-outline',
              color: accentTeal
            }
          }
        });
        yield put({ 
          type: 'formModel/initializeState',
          payload: [
            'password', 'repeatPassword', 'userAgreed'
          ]
        });
        yield put({
          type: 'updateState', payload: { awaitingResponse: false, authenticationState: 'LOGIN' }
        });   
      } else if (err) {
        yield put({
          type: 'formModel/updateState',
          payload: {
            responseMsg: {
              msg: err.message, icon: 'close-circle-outline', color: accentCinnabar
            }
          }
        });  
        yield put({ type: 'updateState', payload: { awaitingResponse: false } });      
      }
    },
    *postRegistration({ payload }, { call, put, select }) {
      yield put({ type: 'updateState', payload: { awaitingResponse: true } });
      const { formModel } = yield select(state => state);
      const response = yield call(request.postRegistration, formModel);
      const { err, data } = response;
      if (data) {
        yield put({
          type: 'formModel/updateState',
          payload: {
            responseMsg: {
              msg: '注册成功', icon: 'checkbox-marked-circle-outline', color: accentTeal
            }
          }
        });
        yield put({ 
          type: 'formModel/initializeState',
          payload: ['password', 'varifyCode', 'varifyPassed', 'userAgreed']
        });
        yield put({
          type: 'updateState',
          payload: { awaitingResponse: false, authenticationState: 'LOGIN' }
        });
      } else if (err) {
        yield put({
          type: 'formModel/updateState',
          payload: {
            responseMsg: {
              msg: err.message, icon: 'close-circle-outline', color: accentCinnabar
            }
          }
        });
        yield put({ type: 'updateState', payload: { awaitingResponse: false } });
      }
    },
    *postPasswordInfo({ payload }, { call, put, select }) {
      const { userModel, formModel } = yield select(state => state);
      const response = yield call(request.postNewPassword, userModel, formModel);
      const { securityMode } = formModel;
      const passwordTarget = _.camelCase(securityMode);

      const { err } = response;
      if (err) {
        yield put({
          type: 'formModel/updateState',
          payload: {
            responseMsg: {
              msg: err.message, icon: 'close-circle-outline', color: accentCinnabar
            }
          }
        });
      } else {
        yield put({
          type: 'formModel/initializeState',
          payload: [passwordTarget, 'newPassword', 'repeatNewPassword']
        });
        yield put({
          type: 'formModel/updateState',
          payload: {
            responseMsg: {
              msg: '密码更换成功', icon: 'checkbox-marked-circle-outline', color: accentTeal
            }
          }
        });
      }
    },
    *deleteBankAccount({ payload }, { call, put, select }) {
      const userModel = yield select(state => state.userModel);
      const response = yield call(request.deleteBankAccount, userModel);
      const { err } = response;
      if (!err) {
        yield put({
          type: 'formModel/updateState',
          payload: {
            responseMsg: {
              msg: '删除银行卡成功', icon: 'checkbox-marked-circle-outline', color: accentTeal
            }
          }
        });
        yield put({ type: 'getCardsAndWithdrawDetail' });
      } else {
        throw new Error(err.message);
      }
    },
  },
  subscriptions: {
    setup({ history, dispatch }) {
			return history.listen(({ pathname }) => {
        switch (pathname) {
          case '/register':
            dispatch({ type: 'createVarifyCode' });
            break;
          case '/user/profile':
            dispatch({ type: 'getCardsAndWithdrawDetail' });
            break;
          default:
            dispatch({ type: 'getAccessToken' });
            break;
        }
        dispatch({ type: 'toggleRegistering', payload: pathname === '/register' });
        dispatch({ type: 'toggleProfileEdit', payload: pathname.indexOf('/user/profile') >= 0 });
			});
		}
  }
};
