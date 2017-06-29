import _ from 'lodash';
import { apiRequest as request } from '../services';
import { accentCinnabar, accentTeal } from '../styles/variables.less';
import { type as TYPE } from '../utils';

const INITIAL_STATE = {
	awaitingResponse: false,
	agentId: '',
	usernameSearchString: '',
	affCodeList: [],
	memberList: [],
	memberListLength: 0,
};

export default {
	namespace: 'teamModel',
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
		*getAffCodeList(payloadObj, { call, put, select }) {
			yield put({ type: 'updateState', payload: { awaitingResponse: true } });
			const { userModel, dataTableModel } = yield select(state => state);
			const response = yield call(request.getAffCodesList, userModel, dataTableModel);
			const { data, err } = response;
			if (data) {
				yield put({
					type: 'updateState', payload: { affCodeList: data.datas }
				});
				yield put({ type: 'updateState', payload: { awaitingResponse: false } });
			} else if (err) {
				yield put({ type: 'updateState', payload: { awaitingResponse: false } });
				throw new Error(err.message);
			}
		},
		*getMemberList(payloadObj, { call, put, select }) {
			yield put({ type: 'updateState', payload: { awaitingResponse: true } });
			const { userModel, dataTableModel, teamModel } = yield select(state => state);
			const response = yield call(request.getMemberList, {
        userModel, dataTableModel, teamModel
      });
			const { data, err } = response;
			if (data) {
				yield put({
					type: 'updateState',
					payload: {
						memberList: data.datas, memberListLength: data.totalCount
					}
				});
				yield put({ type: 'updateState', payload: { awaitingResponse: false } });
			} else if (err) {
				yield put({ type: 'updateState', payload: { awaitingResponse: false } });
				throw new Error(err.message);
			}
		},
		*deleteAffCode({ payload }, { call, put, select }) {
			yield put({ type: 'updateState', payload: { awaitingResponse: true } });
			const { userModel } = yield select(state => state);
			const response = yield call(request.deleteAffCode, userModel, payload);
			const { err } = response;
			if (err) {
				yield put({
          type: 'formModel/updateState',
          payload: {
            responseMsg: {
              msg: `无法删除推广码，${err.message}`, icon: 'close-circle-outline', color: accentCinnabar
            }
          }
        });
				yield put({ type: 'updateState', payload: { awaitingResponse: false } });				
			} else {
				yield put({ type: 'getAffCodeList' });
				yield put({
          type: 'formModel/updateState',
          payload: {
            responseMsg: {
              msg: '推广码已被删除', icon: 'checkbox-marked-circle-outline', color: accentTeal
            }
          }
        });  
				yield put({ type: 'updateState', payload: { awaitingResponse: false } });
			}
		},
		*postUser(payloadObj, { call, put, select }) {
			const { userModel, formModel } = yield select(state => state);
			const response = yield call(request.postUser, userModel, formModel);
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
				yield put({ type: 'getMemberList' });
				yield put({
          type: 'formModel/updateState',
          payload: {
            responseMsg: {
              msg: '创建用户成功', icon: 'checkbox-marked-circle-outline', color: accentTeal
            }
          }
        });  
			}
		},
		*postAffCodeUrl({ payload }, { call, put }) {
			const response = yield call(request.postAffUrl, payload);
			const { data, err } = response;
			if (!data) {
				throw new Error('注册链接无效，请刷新或获取新的注册链接');
			} else if (err) {
				throw new Error(`注册链接无效，${err.message}`);
			} else {
				const { affCode } = data;
				yield put({ type: 'formModel/updateState', payload: { affCode: { value: affCode } } });
				yield put({ type: 'layoutModel/updateState', payload: { shouldShowAuthModel: true } });
				yield put({
					type: 'userModel/updateState',
					payload: { authenticationState: 'REGISTER' }
				});
			}
		},
		*postAffCode(payloadObj, { call, put, select }) {
			yield put({ type: 'updateState', payload: { awaitingResponse: true } });
			const { userModel, formModel } = yield select(state => state);
			const response = yield call(request.postAffCode, userModel, formModel);
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
				yield put({ type: 'updateState', payload: { awaitingResponse: false } });				
			} else {
				yield put({ type: 'getAffCodeList' });
				yield put({
          type: 'formModel/updateState',
          payload: {
            responseMsg: {
              msg: '创建推广码成功', icon: 'checkbox-marked-circle-outline', color: accentTeal
            }
          }
        });
				yield put({ type: 'updateState', payload: { awaitingResponse: false } });
			}
		},
		*putAffCode({ payload }, { call, put, select }) {
			yield put({ type: 'updateState', payload: { awaitingResponse: true } });
			const { userModel, formModel } = yield select(state => state);
			const response = yield call(
				request.putAffCode,
				{ userModel, formModel, payload }
			);
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
				yield put({ type: 'updateState', payload: { awaitingResponse: false } });
			} else {
				yield put({ type: 'getAffCodeList' });
				yield put({
          type: 'formModel/updateState',
          payload: {
            responseMsg: {
              msg: '修改推广码成功', icon: 'checkbox-marked-circle-outline', color: accentTeal
            }
          }
        });
				yield put({ type: 'updateState', payload: { awaitingResponse: false } });
			}
		},
		*putUserInfo(payloadObj, { call, put, select }) {
			yield put({ type: 'updateState', payload: { awaitingResponse: true } });
			const { userModel, formModel } = yield select(state => state);
			const response = yield call(
				request.putUserInfo, userModel, formModel
			);
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
				yield put({ type: 'updateState', payload: { awaitingResponse: false } });
			} else {
				yield put({ type: 'getMemberList' });		
				yield put({
          type: 'formModel/updateState',
          payload: {
            responseMsg: {
              msg: '修改用户成功', icon: 'checkbox-marked-circle-outline', color: accentTeal
            }
          }
        });
				yield put({ type: 'updateState', payload: { awaitingResponse: false } });
			}
		}
	},
	subscriptions: {
		setup({ history, dispatch }) {
			return history.listen(({ search }) => {
        if (search && search.indexOf('?pt=') > -1) {
					const searchIndex = search.indexOf('?pt=');
					const randomCode = search.substring(searchIndex + 4, searchIndex + 10);
					dispatch({ type: 'postAffCodeUrl', payload: { randomCode } });
        }
			});
		}
	}
};
