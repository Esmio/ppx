import _ from 'lodash';
import {
  apiRequest as request,
} from '../services';
import lessVar from '../styles/variables.less';

const { accentTeal, accentCinnabar } = lessVar;

const INITIAL_STATE = {
  allBetObj: {},
  allOpenOptions: {},
  amount: 0,
  amountUnit: 1,
  awaitingResponse: false,
  betEntries: [],
  current: {},
  gameMethod: '',
  initialAmount: 2,
  lastOpen: {},
  methodGroup: '',
  methodId: '',
  multiply: 1,
  gameNav: '',
  gameSubNav: '',
  numberOfUnits: 0,
  repeatEntryIndex: '',
  responseColor: '',
  responseMessage: '',
  returnMoneyRatio: 0,
  thisBetObj: '',
  thisBetString: '',
  thisGameId: 'HF_CQSSC',
  thisMethodSetting: '',
  thisGameSetting: '',
  thisGamePrizeSetting: '',
  thisMethodPrizeSetting: '',
  thisOpenOption: '',
};

export default {
  namespace: 'betCenter',
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
    *getCurrentGameResult(payloadObj, { call, put, select }) {
      const { betCenter } = yield select(state => state);
      const { thisGameId } = betCenter;
      const response = yield call(request.getCurrentResults, thisGameId);
      const { data, err } = response;
      if (data) {
        yield put({ type: 'updateState', payload: { ...data } });
      } else if (err) {
        throw new Error('无法获取该开彩信息');
      }
    },
    *postBetEntries(payloadObj, { call, put, select }) {
      yield put({ type: 'updateState', payload: { awaitingResponse: true } });
      const { betCenter, userModel } = yield select(state => state);
      let { betEntries } = betCenter;
      let totalAmount = 0;
      let totalUnits = 0;
      _.forEach(betEntries, (entry) => {
        const { amount, numberOfUnits } = entry;
        totalAmount += amount;
        totalUnits += numberOfUnits;
      });
      const { current } = betCenter;
      const { accessToken } = userModel;
      const { gameUniqueId, uniqueIssueNumber } = current;
      const userSubmitTimestampMillis = +new Date();
      const drawIdentifier = {
        gameUniqueId, issueNum: `${uniqueIssueNumber}`
      };
      betEntries = _.map(betEntries, (entry) => {
        return _.pick(entry, [
            'amount', 'betString', 'gameplayMethod', 'numberOfUnits',
            'pricePerUnit', 'returnMoneyRatio'
        ]);
      });
      const order = {
        betEntries,
        drawIdentifier,
        numberOfUnits: totalUnits,
        purchaseInfo: {
					purchaseType: 'METHOD_UNDEFINED'
				},
        totalAmount,
        userSubmitTimestampMillis,
      };
      const response = yield call(request.postEntries, { order, accessToken });
      const { data, err } = response;
      if (data) {
        yield put({ type: 'initializeState', payload: ['betEntries'] });
        yield put({
          type: 'updateState',
          payload: {
            awaitingResponse: false,
            responseMessage: '投注成功祝你中奖',
            responseColor: accentTeal
          }
        });
        yield put({ type: 'orderModel/getOrderHistory' });
      } else if (err) {
        yield put({
          type: 'updateState',
          payload: {
            awaitingResponse: false,
            responseMessage: err.message,
            responseColor: accentCinnabar
          }
        });
      }
    }
  }
};
