import React, { Component } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { type } from '../../utils/';
import css from '../../styles/playground/gameboard.less';

class GamboardControllerBtns extends Component {
  constructor(props) {
    super(props);
    this.state = {
      全: [],
      大: [],
      小: [],
      奇: [],
      偶: [],
      清: []
    };
  }
  componentWillMount() {
    this.sortButtonSet(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.sortButtonSet(nextProps); 
  }
  onClickHandler({ arrayName, btnIsActive }) {
    const { onSelect } = this.props;
    if (onSelect) {
      onSelect(btnIsActive ? [] : this.state[arrayName]);
    }
  }
  getArray(numbers) {
    let numberSetKeys = _.keys(numbers);
    const firstValue = numbers[numberSetKeys[0]];
    if (_.isArray(firstValue)) {
      numberSetKeys = _.map(numberSetKeys, (num) => _.split(num, '-')[0]);
      return numberSetKeys;
    }
    return numbers;
  }
  isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
  sortButtonSet({ numbers }) {
    const all = this.getArray(numbers);
    const halfIndex = Math.floor((all.length) / 2);
    const big = [];
    const small = [];
    const odd = [];
    const even = [];
    _.forEach(all, (number, index) => {
      const int = parseInt(number, 10);
      const isNumber = this.isNumeric(number);
      const isSymbolic = _.indexOf(type.SYMBOLICS, number) >= 0;
      const isOdd = 
        int % 2 === 1 ||
        /单/i.test(number) ||
        (isSymbolic && (index + 1) % 2 === 1);
      const isEven =
        int % 2 === 0 ||
        /双/i.test(number) ||
        (isSymbolic && (index + 1) % 2 === 0);
      const isBig = 
        /大/i.test(number) || 
        (isNumber && index > halfIndex) ||
        (isSymbolic && index > halfIndex);
      const isSmall = 
        /小/i.test(number) || 
        (isNumber && index <= halfIndex) ||
        (isSymbolic && index <= halfIndex);
      if (isOdd) {
        odd.push(number);
      }
      if (isEven) {
        even.push(number);
      }
      if (isBig) {
        big.push(number);
      }
      if (isSmall) {
        small.push(number);
      }
    });
    // console.debug('all', all);
    // console.debug('big', big);
    // console.debug('small', small);
    // console.debug('odd', odd);
    // console.debug('even', even);
    
    this.setState({ 全: [...all], 大: [...big], 小: [...small], 奇: [...odd], 偶: [...even] });
  }
  render() {
    const { existingPicks, selectedGameName, sectionName } = this.props;
    const thisGame = existingPicks[selectedGameName] || {};
    const thisSection = thisGame[sectionName] || [];
    return (
      <div>
        { 
          _.map(this.state, (array, arrayName) => {
            const btnIsActive = thisSection.length && _.isEqual(thisSection, array);
            const btnIsDisabled = arrayName !== '清' && !array.length;
            const btnClass = 
              btnIsActive ? css.gameboard_controllerBtn__active :
              css.gameboard_controllerBtn;
            return (
              <button
                key={arrayName}
                className={btnClass}
                onClick={this.onClickHandler.bind(this, { arrayName, btnIsActive })}
                disabled={btnIsDisabled}
              >{ arrayName }</button>
            );
          })
        }
      </div>
    );
  }
}

const mapStatesToProps = ({ playgroundModel }) => {
  const { existingPicks, selectedGameName } = playgroundModel;
  return { existingPicks, selectedGameName };
};

export default connect(mapStatesToProps)(GamboardControllerBtns);
