import * as service from '../services/specialOffer';

export default {
  namespace: 'specialoffer',
  state: {
    promotionList: null,
    pcPromotionTopImage: ''
  },
  reducers: {
  	save(state, action) {
  		return {...state, ...action.payload}
  	}
  },
  effects: {
  	*SpecialOfferList({payload}, {call, put}) {
  		const {data} = yield call(service.getSpecialOfferList);
  		yield put({ type: 'save', payload: {...data}})
  	}
  },
  subscriptions: {
  	setup({dispatch, history}) {
      history.listen(({pathname, query})=>{
        if(pathname==='/specialoffer' || pathname==='specialoffer') {
          dispatch({type:'SpecialOfferList'})
        }
      })
    }
  },  
}