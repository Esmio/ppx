import {
  apiRequest as request
} from '../services';

const INITIAL_STATE = {
  winnerList: null,
  allHistory: null,
  highFreqSelectedTab: null,
  highFreqSelectedContent: null,
  lowFreqSelectedTab: null,
  lowFreqSelectedContent: null,
	announcement: null,
	announcements: null,
	gameInfosHot: null,
	gameInfosRecommend: null,
	generalContents: null,
	menuIcons: null,
	promotionBanners: null
};

export default {
	namespace: 'homeInfoModel',
	state: INITIAL_STATE,
	reducers: {
		getTopWinnersSuccess(state, { payload }) {
			const { data } = payload;
			// console.debug('getTopWinnersSuccess', data);
			return { ...state, winnerList: data };
		},
		selectTab(state, { payload }) {
			// console.debug('selectTab', payload);
      return {
        ...state,
        [`${payload.frequency}SelectedTab`]: payload.tabName,
        [`${payload.frequency}SelectedContent`]: payload.tabContent
      };
    },
	},
	effects: {
		*getHomepageInfo(payload, { call, put }) {
			const response = yield call(request.getHomepageInfo);
			const { data, err } = response;
      if (data) {
        yield put({ type: 'getHomepageInfoSuccess', payload: response });
      } else if (err) {
        console.error(`获取首页质询 ${err.message}`);				
			} else if (!err && !data) {
        console.debug('获取首页质询 payload', payload);
      }
		},
		*getTopWinners(payload, { call, put }) {
			const response = yield call(request.getTopWinners);
			const { data, err } = response;
			if (data) {
				yield put({ type: 'getTopWinnersSuccess', payload: response });
			} else if (err) {
				console.error(`玩家胜利名次 ${err.message}`);				
			} else if (!err && !data) {
				console.debug('玩家胜利名次 payload', payload);
			}
		},
	},
	subscriptions: {
		setup({ history, dispatch }) {
			return history.listen(({ pathname }) => {
				if (pathname === '/') {
					dispatch({ type: 'getHomepageInfo' });
					dispatch({ type: 'getTopWinners' });
					dispatch({ type: 'layoutModel/setSideNavVisibility', payload: true });
					dispatch({ type: 'layoutModel/overwriteSideNav', payload: true });
				} else {
					dispatch({ type: 'layoutModel/setSideNavVisibility', payload: false });
					dispatch({ type: 'layoutModel/overwriteSideNav', payload: false });
				}
			});
		}
	}
};
