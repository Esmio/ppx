import React from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import predictMap from '../../assets/image/prediction_map.png';
import { Row } from '../General';
import css from '../../styles/homepage/PredictMap.less';

function PredictMap({
  gameInfosRecommend
}) {
  function renderSingleList(list) {
    return (
      <div className={css.predictPanel_list}>
        {
          list.map((item, key) => {
            const { gameUniqueId, gameNameInChinese } = item;
            return (
              <p
                key={gameUniqueId + key}
                className={css.predictPanel_listItem}
              >
                {gameNameInChinese}
              </p>
            );
          })
        }
      </div>
    );
  }
  function renderLists() {
    const highFreqList = [];
    const lowFreqList = [];
    _.forEach(gameInfosRecommend, (infoObject) => {
			// console.debug(infoObject);			
			if (infoObject.frequency === 'LOW') {
				lowFreqList.push(infoObject);
			} else if (infoObject.frequency === 'HIGH') {
				highFreqList.push(infoObject);
			}
		});
    return (
      <div className={css.predictPanel_rates}>
        <h5 className={css.predictPanel_label}>高频彩</h5>
        { highFreqList.length && renderSingleList(highFreqList) }
        <h5 className={css.predictPanel_label}>低频彩</h5>
        { lowFreqList.length && renderSingleList(lowFreqList) }
      </div>
    );
  }

  return (
    <Row className={css.predictPanel}>
      <h2 className={css.predictPanel_header}>彩票走勢圖</h2>
      <img src={predictMap} alt="demo prediction map" className={css.predictPanel_banner} />
      { gameInfosRecommend && renderLists(gameInfosRecommend)}
    </Row>
  );
}

const mapStatesToProps = ({ gameInfosModel }) => {
  const {
		gameInfosRecommend
  } = gameInfosModel;
  return {
		gameInfosRecommend
  };
};

export default connect(mapStatesToProps)(PredictMap);
