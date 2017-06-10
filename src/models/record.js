import _ from 'lodash';
import { apiRequest as request } from '../services';

const INITIAL_STATE = {
  currentPage: 1,
  allDetailsHistory: [],
  orderHistory: [],
  orderInfo: '',
  pageSize: 20,
  start: 1,
  state: 'ALL',
  subOrders: [],
  subType: 'ALL',
  transactionHistory: [],
  type: 'ALL',
};

export default {
  namespace: 'recordModel',
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
    *getOrderHistory({ payload }, { call, put, select }) {
      const { userModel, recordModel } = yield select(state => state);
      const response = yield call(request.getOrderHistory, userModel, recordModel);
      const { data, err } = response;
      if (data) {
        yield put({ type: 'updateState', payload: { orderHistory: data.datas } });
      } else if (err) {
        throw new Error(`无法获取购彩记录，${err.message}`);
      }
    },
    *getTransactionHistory({ payload }, { call, put, select }) {
      const { userModel, recordModel } = yield select(state => state);
      const response = yield call(request.getTransactionHistory, userModel, recordModel);
      const { data, err } = response;
      if (data) {
        yield put({ type: 'updateState', payload: { transactionHistory: data } });
      } else if (err) {
        throw new Error(`无法获取交易记录, ${err.message}`);
      }
    },
    *getMyDetails({ payload }, { call, put, select }) {
      const { userModel } = yield select(state => state);
      const response = yield call(request.getMyDetails, userModel);
      const { data, err } = response;
      if (data) {
        yield put({ type: 'updateState', payload: { allDetailsHistory: data } });
      } else if (err) {
        throw new Error(`无法获取账户明细，${err.message}`);
      }
    },
    *getOrderDetails({ payload }, { call, put, select }) {
      const { userModel, recordModel } = yield select(state => state);
      yield put({ type: 'storeUuid', payload });
      const response = yield call(request.getOrderDetails, userModel, recordModel);
      const { err, data } = response;
      if (data) {
        yield put({
          type: 'updateState', payload: { ...data }
        });
      } else {
        throw new Error(`无法获取订单详情, ${err}`);
      }
    },
  },
  subscriptions: {}
};
