import dva from 'dva';
import { message } from 'antd';
import { browserHistory } from 'dva/router';
import './styles/index.less';

// 1. Initialize
const app = dva(
  {
    history: browserHistory,
    onError(e) {
      console.error('on Error', e);
      message.error(e.message, /* duration */3);
    }
  }
);

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./models/user'));
app.model(require('./models/gameInfos'));
app.model(require('./models/homepage'));
app.model(require('./models/layout'));
app.model(require('./models/playground'));
app.model(require('./models/trendChart'));
app.model(require('./models/specialOffer'));
app.model(require('./models/form'));
app.model(require('./models/transfer'));
app.model(require('./models/record'));
// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
