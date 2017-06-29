import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MDIcon } from '../General';
import { type as TYPE, addCommas } from '../../utils';
import css from './styles/GameCal.less';

class GameCal extends Component {
  renderAmountUnitsBtn() {
    const { onUnitToggle, amountUnit } = this.props;
    return _.map(TYPE.UNITS, (unit, unitName) => {
      const btnActive = unit === amountUnit;
      const btnProps = {
        key: unitName,
        className: css.gameCal_unitBtn,
        'data-active': btnActive,
        onClick: onUnitToggle.bind(this, unit),
        disabled: btnActive
      };
      return (
        <button {...btnProps}>{ unitName }</button>
      );
    });
  }
  render() {
    const {
      multiply, numberOfUnits, onInitializeClick, onMultipleChange,
      onAddEntry, onRandomClick, disabledAddEntry, repeatEntryIndex, getAmount
    } = this.props;
    return (
      <div className={css.gameCal}>
        <span className={css.gameCal_numberOfUnits}>共 { numberOfUnits } 注</span>
        <button
          className={css.gameCal_multiplyBtn}
          onClick={onMultipleChange.bind(this, multiply - 1)}
        >
          <MDIcon iconName="minus" />
        </button>
        <input
          type="number" value={multiply}
          className={css.gameCal_multiplyInput}
          onChange={({ target }) => onMultipleChange(target.value)}
        />
        <button
          className={css.gameCal_multiplyBtn}
          onClick={onMultipleChange.bind(this, multiply + 1)}
        >
          <MDIcon iconName="plus" />
        </button>
        <span className={css.gameCal_multiplySpan}>倍</span>
        { this.renderAmountUnitsBtn() }
        <span className={css.gameCal_amountSpan}>金额：{ addCommas(getAmount()) } 元</span>
        <div className={css.gameCal_ctrlBtns}>
          <button
            onClick={onInitializeClick} className={css.gameCal_ctrlBtn__clear}
          >清</button>
          <button
            onClick={onMultipleChange.bind(this, multiply * 2)}
            className={css.gameCal_ctrlBtn}
          >
            加倍
          </button>
          <button
            disabled={disabledAddEntry}
            className={css.gameCal_ctrlBtn} onClick={onAddEntry}
          >
            {repeatEntryIndex > -1 ? '重复投注项' : '添加'}
          </button>
          <button onClick={onRandomClick} className={css.gameCal_ctrlBtn}>随机</button>
        </div>
      </div>
    );
  }
}

GameCal.propTypes = {
  thisGameId: PropTypes.string
};

export default GameCal;
