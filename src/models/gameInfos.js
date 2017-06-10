import { message } from 'antd';
import {
  apiRequest as request
} from '../services';

const INITIAL_STATE = {
  allHistory: null,
	allGamesPrizeSettings: null,
	announcement: null,
	announcements: null,
	gameInfosHot: null,
	gameInfosRecommend: null,
	generalContents: null,
	menuIcons: null,
	promotionBanners: null
};

export default {
	namespace: 'gameInfosModel',
	state: INITIAL_STATE,
	reducers: {
		getHomepageInfoSuccess(state, { payload }) {
			const { data } = payload;
			// console.debug('getHomepageInfoSuccess', data);
			return { ...state, ...data };
		},
		getAllHistorySuccess(state, { payload }) {
			const { data } = payload;
			// console.debug('getAllHistorySuccess', data);
			return { ...state, allHistory: data };
		},
		getAllGamesSettingSuccess(state, { payload }) {
			const { allGamesPrizeSettings } = payload;

			// console.debug('getAllGamesSettingSuccess', allGamesPrizeSettings);
			return { ...state, allGamesPrizeSettings };
		}
	},
	effects: {
		*getHomepageInfo(payload, { call, put }) {
			const response = yield call(request.getHomepageInfo);
			const { data, err } = response;
      if (data) {
        yield put({ type: 'getHomepageInfoSuccess', payload: response });
      } else if (err) {
        message.error(`${err.message}`);				
			} else if (!err && !data) {
        console.debug('获取首页质询 payload', payload);
      }
		},
		*getAllHistory(payload, { call, put }) {
			const response = yield call(request.getAllHistory);
			const { data, err } = response;
			if (data) {
				yield put({ type: 'getAllHistorySuccess', payload: response });
			} else if (err) {
				message.error(`${err.message}`);				
			} else if (!err && !data) {
				console.debug('开奖大厅 payload', payload);
			}
		},
		*getAllGamesSetting(payload, { call, put }) {
			const response = yield call(request.getAllGamesSetting);
			const { data, err } = response;
			if (data) {
				yield put({ type: 'getAllGamesSettingSuccess', payload: data });
			} else if (err) {
				message.error(`${err.message}`);				
			} else if (!err && !data) {
				console.debug('购彩大厅 payload', payload);
			}
		}
	},
	subscriptions: {
		setup({ history, dispatch }) {
			return history.listen(({ pathname, action }) => {
				function pathnameWasntReplace() {
					return action !== 'REPLACE';
				}
				if (pathnameWasntReplace()) {
					if (pathname === '/') {
						dispatch({ type: 'getAllHistory' });
					}
					dispatch({ type: 'getHomepageInfo' });
					dispatch({ type: 'getAllGamesSetting' });
				}
			});
		}
	}
};
