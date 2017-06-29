import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { addCommas } from '../../utils';
import { RangeInput } from '../General';
import css from './styles/RatioCtrl.less';

class ReturnRatioCtrl extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.thisMethodPrizeSetting !== nextProps.thisMethodPrizeSetting) {
      this.mapPropToStates(nextProps);
    }
  }
  
  mapPropToStates({ thisMethodPrizeSetting }) {
    this.setState({ ...thisMethodPrizeSetting });
  }
  renderScene() {
    const {
      getAmountPerUnit, userData, returnMoneyRatio, onRangeChange, getEntriesTotal
    } = this.props;
    const { prizeSettings } = this.state;
    let maxRange = userData ? ((userData.prizeGroup - 1800) / 200) * 10 : 10;
    maxRange = maxRange.toFixed(1);
    if (prizeSettings && prizeSettings.length >= 1) {
      const ratio = ((100 - returnMoneyRatio) / 100).toFixed(2);
      const prize = _.maxBy(prizeSettings, (p) => p.prizeAmount);
      let prizeAmount = prize.prizeAmount * ratio;
      prizeAmount = prizeAmount.toFixed(2);
      let amount = getAmountPerUnit() * prizeAmount;
      amount = amount.toFixed(2);
      const { totalAmount, totalUnits } = getEntriesTotal();
      return (
        <div>
          <p className={css.ratioCtrl_paragraph}>
            <span className={css.ratioCtrl_label}>总注数</span>
            <span className={css.ratioCtrl_content}>{totalUnits}</span>
          </p>
          <p className={css.ratioCtrl_paragraph}>
            <span className={css.ratioCtrl_label}>总金额</span>
            <span className={css.ratioCtrl_content}>{addCommas(totalAmount)} 元</span>
          </p>
          <p className={css.ratioCtrl_paragraph}>
            <span className={css.ratioCtrl_label}>当前返点</span>
            <span className={css.ratioCtrl_content}>{returnMoneyRatio}%</span>
          </p>
          <div className={css.ratioCtrl_rangeInput}>
            <RangeInput
              style={{ marginBottom: 0 }}
              onDrag={({ target }) => onRangeChange(target.value)}
              onChange={({ target }) => onRangeChange(target.value)}
              minLabel="0%"
              maxLabel={`${maxRange}%`}
              indicatorLabel={`${ratio} (${returnMoneyRatio}%)`}
              name="prizeGroup"
              min={0}
              max={maxRange}
              step={0.1}
              value={returnMoneyRatio}
            />
          </div>
          <p className={css.ratioCtrl_paragraph}>
            <span className={css.ratioCtrl_label}>最高奖金</span>
            <span className={css.ratioCtrl_content}>+{addCommas(amount)} 元</span>
          </p>
          <p className={css.ratioCtrl_paragraph}>
            <span className={css.ratioCtrl_label}>最高赔率</span>
            <span className={css.ratioCtrl_content}>x{prizeAmount}</span>
          </p>
        </div>
      );
    } return null;
  }
  render() {
    return (
      <div className={css.ratioCtrl}>
        { this.renderScene() }
      </div>
    );
  }
}

ReturnRatioCtrl.propTypes = {
  thisMethodPrizeSetting: PropTypes.object
};

export default ReturnRatioCtrl;
