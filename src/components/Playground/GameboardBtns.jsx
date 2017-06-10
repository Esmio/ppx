import React from 'react';
import classnames from 'classnames';
import _ from 'lodash';
import { getPrizeAmount } from '../../utils/';
import css from '../../styles/playground/gameboard.less';

export default function GameboardBtns({
  btnsCollection,
  groupLabel,
  onSinglePick,
  isValueExist,
  prizeSettings
}) {
  // console.debug(prizeSettings);
  const rowLength = Math.round((btnsCollection.length + 1) / 3);
  const breakpoint = (btnsCollection.length > 11 && rowLength <= 11) ? rowLength : 11;
  function onBtnClickHandler(number) {
    if (onSinglePick) {
      onSinglePick(number);
    }
    return;
  }
  function shouldShowAmount(groupLabelInstance, prizeSettingsInstance) {
    return _.isEmpty(groupLabelInstance) && !_.isEmpty(prizeSettingsInstance);
  }
  return (
    <p className={css.gamboard_bodyBtns}>
      {
        btnsCollection && _.map(btnsCollection, (number, index) => {
          const isActive = isValueExist(groupLabel || number);
          const btnClass = isActive ? 
            css.gamboard_bodyBtnContent__active :
            css.gamboard_bodyBtnContent;
          const prizeAmount = prizeSettings ? 
            prizeSettings.length === btnsCollection.length ?
            prizeSettings[index].prizeAmount :
            getPrizeAmount({ prizeName: number, prizeSettings }) 
            : null;
          return (
            <span key={number} className={css.gamboard_bodyBtn}>
              <span
                className={classnames(
                  btnClass, shouldShowAmount(groupLabel, prizeSettings) ? css.hasBtnAmount 
                  : null
                )}
                onClick={onBtnClickHandler.bind(this, number)}
              >
                { number }
                { shouldShowAmount(groupLabel, prizeSettings) &&
                  <span className={css.gameboard_bodyBtnAmount}>
                    { prizeAmount }
                  </span>
                }
              </span>
              { (index + 1) % breakpoint === 0 ? <br /> : null}
            </span>
          );
        })
      }
    </p>
  );
}
