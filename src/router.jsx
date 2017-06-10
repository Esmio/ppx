import React from 'react';
import moment from 'moment';
import { Router, Route } from 'dva/router';
import HomePage from './components/HomePage/';
import PlaygroundIndex from './components/Playground/';
import TrendChartIndex from './components/TrendChart/';
import TrendPage from './components/TrendPage/';
import SpecialOffer from './components/SpecialOffer';

moment.locale('zh-cn');

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={HomePage} />
      <Route path="/playground" component={PlaygroundIndex} />
      <Route path="/trend" component={TrendChartIndex}/>
      <Route path="/trendpage" component={TrendPage}/>
      <Route path="/specialoffer" component={SpecialOffer}/>
    </Router>
  );
}

export default RouterConfig;
