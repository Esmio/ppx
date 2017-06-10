import _ from 'lodash';
import { accentCinnabar, accentTeal } from '../styles/variables.less';
import { apiRequest as request } from '../services';

const INITIAL_STATE = {
  adminBankId: '',
  amount: '',
  awaitingResponse: false,
  bankList: [],
  data: '',
  dataImg: '',
  merchantName: '',
  paymentId: '',
  paymentList: [],
  paymentMethod: '',
  paymentPlatformCode: '',
  paymentType: '',
  topupCode: '',
  topupType: 'ZHB', 
  transactionId: '',
  transactionTimeuuid: '',
  transferNo: '',
  userBankId: '',
  webview: false,
};

export default {
  namespace: 'transferModel',
  state: INITIAL_STATE,
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
    initializeState(state, { payload }) {
      const initialStates = _.pick(INITIAL_STATE, payload);
      return { ...state, ...initialStates };
    },
  },
  effects: {
    *getPaymentList({ payload }, { call, put, select }) {
      const { userModel } = yield select(state => state);
      const response = yield call(request.getPaymentList, userModel);
      const { data, err } = response;
      if (data) {
        yield put({ type: 'updateState', payload: { paymentList: data } });
      } else if (err) {
        throw new Error('无法获取充值信息', err.message);
      }
    },
    *getBankList({ payload }, { call, put, select }) {
      const { userModel } = yield select(state => state);
      const response = yield call(request.getBankList, userModel);
      const { data, err } = response;
      if (data) {
        yield put({ type: 'updateState', payload: { bankList: data } });
      } else if (err) {
        throw new Error('无法获取提款信息', err.message);
      }
    },
    *putBankTransferConfirmation({ payload }, { call, put, select }) {
      const { userModel, formModel, transferModel } = yield select(state => state);
      yield put({ type: 'updateState', payload: { awaitingResponse: true } });
      const response = yield call(
        request.putBankTransferConfirmation,
        { userModel, formModel, transferModel }
      );
      const { err, data } = response;
      if (data) {
        yield put({
          type: 'initializeState',
          payload: ['adminBankId', 'paymentPlatformOrderNo']
        });
        yield put({
          type: 'formModel/initialzeState',
          payload: ['bankName', 'bankCardNo', 'receiptName', 'bankAddress', 'remarks']
        });
        yield put({ type: 'updateState', payload: { ...data } });
        yield put({
          type: 'formModel/updateState',
          payload: {
            responseMsg: {
              color: accentTeal,
              icon: 'checkbox-marked-circle-outline',
              msg: `${data.transferNo} 已经开始进行处理`
            }
          }
        });
        yield put({ type: 'updateState', payload: { awaitingResponse: false } });
      } else {
        yield put({
          type: 'formModel/updateState',
          payload: {
            responseMsg: {
              color: accentCinnabar,
              icon: 'close-circle-outline',
              msg: err.message
            }
          }
        });
        yield put({ type: 'updateState', payload: { awaitingResponse: false } });
      }
    },
    *postTopups({ payload }, { call, put, select }) {
      const { userModel, formModel, transferModel } = yield select(state => state);
      yield put({ type: 'updateState', payload: { awaitingResponse: true } });
      const response = yield call(
        request.postTopupRequest, { formModel, userModel, transferModel }
      );
      if (response) {
        yield put({ type: 'updateState', payload: { awaitingResponse: false } });        
      }
      const { data, err } = response;
      if (data) {
        const { paymentMethod, webview } = data;
        yield put({ type: 'updateState', payload: { ...data } });
        if ((webview && data.data) || (paymentMethod === 'BANK_ONLINE' && data.data)) {
          window.open(data.data, paymentMethod);
          yield put({
            type: 'formModel/updateState',
            payload: {
              responseMsg: {
                color: accentTeal,
                icon: 'checkbox-marked-circle-outline',
                msg: '请在跳转页面完成转账工序'
              }
            }
          });
          yield put({ type: 'initializeState', payload: ['merchantName'] });
          yield put({ type: 'formModel/initializeState', payload: ['topupAmount'] });
        } else if (!data.data) {
          yield put({
            type: 'formModel/updateState',
            payload: {
              responseMsg: {
                color: accentCinnabar,
                icon: 'close-circle-outline',
                msg: '此支付对象暂时无法使用，请选择别的支付对象'
              }
            }
          });
        } 
      } else if (err) {
        yield put({
          type: 'formModel/updateState',
          payload: {
            responseMsg: {
              color: err ? accentCinnabar : accentTeal,
              icon: err ? 'close-circle-outline' : 'checkbox-marked-circle-outline',
              msg: `无法获取转账信息, ${err.message}`
            }
          }
        });
      }
    },
    *postWithdrawalRequest({ payload }, { call, put, select }) {
      const { userModel, transferModel, formModel } = yield select(state => state);
      yield put({ type: 'updateState', payload: { awaitingResponse: true } });
      
      const response = yield call(
        request.postWithdrawalRequest,
        { userModel, transferModel, formModel }
      );
      const { data, err } = response;
      if (data) {
        const { transactionTimeuuid } = data;
        yield put({ type: 'updateState', payload: { transactionTimeuuid } });
        yield put({ type: 'updateState', payload: { awaitingResponse: false } });
        yield put({
          type: 'formModel/initializeState',
          payload: ['withdrawalAmount', 'securityPassword', 'charge']
        });
        yield put({
          type: 'formModel/updateState',
          payload: {
            responseMsg: {
              color: accentTeal,
              icon: 'checkbox-marked-circle-outline',
              msg: `${transactionTimeuuid} 已经开始进行处理`
            }
          }
        });
        yield put({ type: 'userModel/getCardsAndWithdrawDetail' });
      } else if (err) {
        yield put({
          type: 'formModel/updateState',
          payload: {
            responseMsg: {
              color: accentCinnabar,
              icon: 'close-circle-outline',
              msg: `提款申请失败, ${err.message}`
            }
          }
        });
        yield put({ type: 'updateState', payload: { awaitingResponse: false } });        
      } 
    }
  },
  subscriptions: {}
};
