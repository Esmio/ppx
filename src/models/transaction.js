import _ from 'lodash';
import { apiRequest as request } from '../services';

const INITIAL_STATE = {
  awaitingResponse: false,
  subType: 'ALL',
  state: 'ALL',
  transactionHistory: [],
  type: 'ALL',
};

export default {
	namespace: 'transactionModel',
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
    *getTransactionHistory(payloadObj, { call, put, select }) {
      yield put({ type: 'updateState', payload: { awaitingResponse: true } });
      const { userModel, dataTableModel, transactionModel } = yield select(state => state);
      const response = yield call(request.getTransactionHistory, { 
        userModel, dataTableModel, transactionModel
      });
      const { data, err } = response;
      if (data) {
        yield put({ type: 'updateState', payload: { awaitingResponse: false } });
        yield put({ type: 'updateState', payload: { transactionHistory: data } });
      } else if (err) {
        yield put({ type: 'updateState', payload: { awaitingResponse: false } });
        throw new Error(`无法获取交易记录, ${err.message}`);
      }
    },
  }
};
