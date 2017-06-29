const INITIAL_STATE = {
	lotteryHeight: 0,
	lotteryNoticeHeaderHeight: 0,
	predictMapHeight: 0, 
	QRPanelHeight: 0,
	rightPanelHeight: 0,
	sideNavHeight: 0,
	tutorialListHeight: 0,
	winnerListHeight: 0,
  activeTab: '',
  centerPanelHeight: 0,
  lotteryCountersHeight: 0,
  shouldShowSideNav: false,
  sideNavIsLocked: false,
  winnerListHeaderHeight: 0,
  shouldShowProfileModal: false,
  shouldShowAuthModel: false,
  profileGroupNav: '我的信息',
  profileExpandedNav: 'account',
  profileSelectedNav: 'basicInfo'
};

export default {
  namespace: 'layoutModel',
  state: INITIAL_STATE,
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
    initializeState(state, { payload }) {
      const initialState = _.pick(INITIAL_STATE, payload);
      return { ...state, ...initialState };
    },
    setActiveTab(state, { payload }) {
      return { ...state, activeTab: payload };
    },
    overwriteSideNav(state, { payload }) {
      return { ...state, sideNavIsLocked: payload };
    },
    setSideNavVisibility(state, { payload }) {
      return { ...state, shouldShowSideNav: payload };
    },
    toggleForm(state, { payload }) {
      const { target, isExpanded } = payload;
      return { ...state, [`${target}InfoFormExpanded`]: isExpanded };
    },
    lockForm(state, { payload }) {
      const { target, isLock } = payload;
      return { ...state, [`${target}InfoFormIsLocked`]: isLock };
    },
    selectUserProfileNav(state, { payload }) {
      return { ...state, userProfileSelectedNav: payload };
    }
  },
  effects: {
  },
  subscriptions: {
    setup({ history, dispatch }) {
			return history.listen(({ pathname }) => {
        dispatch({ type: 'toggleForm',
          payload: { target: 'user', isExpanded: pathname.indexOf('/user/profile') >= 0 } 
        });
        dispatch({ type: 'toggleForm',
          payload: { target: 'bank', isExpanded: pathname.indexOf('/user/profile') >= 0 } 
        });
        dispatch({ type: 'lockForm',
          payload: { target: 'user', isLock: pathname.indexOf('/user/profile') < 0 } 
        });
        dispatch({ type: 'lockForm',
          payload: { target: 'bank', isLock: pathname.indexOf('/user/profile') < 0 } 
        });
			});
		}
  }
};
