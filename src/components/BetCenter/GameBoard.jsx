import React, { Component } from 'react';
import css from './styles/GameBoard.less';
import { type as TYPE } from '../../utils';

class Gameboard extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      全: [],
      大: [],
      小: [],
      奇: [],
      偶: [],
      清: []
    };
    this.dispatch = this.props.dispatch.bind(this);
    this.splitGroupSet = this.splitGroupSet.bind(this);
    this.isNumeric = this.isNumeric.bind(this);
  }
  componentWillMount() {
    this.splitGroupSet(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.splitGroupSet(nextProps);
  }
  isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
  splitGroupSet({ thisMethodSetting }) {
    if (thisMethodSetting) {
      const { gameRules } = thisMethodSetting;
      const { set } = gameRules;
      const setHalfIndex = Math.round(set.length / 2);
      const all = [];
      const largeGroup = [];
      const smallGroup = [];
      const oddGroup = [];
      const evenGroup = [];
      _.forEach(set, (number, index) => {
        let bet = number;
        if (_.isArray(bet)) {
          bet = index;
        }
        all.push(bet);
        const int = parseInt(bet, 10);
        const isNumber = this.isNumeric(bet);
        const isSymbolic = _.indexOf(TYPE.SYMBOLICS, number) > -1;
        const isOdd = 
          int % 2 === 1 ||
          /单/i.test(bet) ||
          (isSymbolic && (index + 1) % 2 === 1);
        const isEven =
          int % 2 === 0 ||
          /双/i.test(bet) ||
          (isSymbolic && (index + 1) % 2 === 0);
        const isBig = 
          /大/i.test(bet) || 
          (isNumber && index >= setHalfIndex) ||
          (isSymbolic && index >= setHalfIndex);
        const isSmall = 
          /小/i.test(bet) || 
          (isNumber && index < setHalfIndex) ||
          (isSymbolic && index < setHalfIndex);
        if (isOdd) {
          oddGroup.push(bet);
        }
        if (isEven) {
          evenGroup.push(bet);
        }
        if (isBig) {
          largeGroup.push(bet);
        }
        if (isSmall) {
          smallGroup.push(bet);
        }
      });
      
      this.setState({
        全: [...all],
        大: [...largeGroup],
        小: [...smallGroup],
        奇: [...oddGroup],
        偶: [...evenGroup]
      });
    }
  }
  renderControllerBtns(section) {
    const { thisBetObj, onControllerClick } = this.props;
    
    return _.map(this.state, (group, groupName) => {
      const thisSection = thisBetObj[section];
      const btnProps = {
        className: css.gameboard_ctrlBtn,
        onClick: onControllerClick.bind(this, { section, group }),
        key: groupName,
        disabled: !group.length && groupName !== '清',
        'data-active': thisSection && _.isEqual(thisSection, group) && groupName !== '清'
      };
      return (
        <button {...btnProps}>
          { groupName }
        </button>
      );
    });
  }
  renderArrayBtn(section, set) {
    const { thisBetObj, onBetClick } = this.props;
    
    return _.map(set, (betArray, arrayKey) => {
      const btnProps = {
        className: css.gameboard_groupBtn,
        onClick: onBetClick.bind(this, { section, bet: arrayKey }),
        key: arrayKey,
        'data-active': thisBetObj[section] && thisBetObj[section].indexOf(arrayKey) > -1
      };
      return (
        <button {...btnProps}>
          { arrayKey }
          <span className={css.gameboard_groupBtnSpans}>
            { 
              _.map(betArray, (bet) => {
                return (
                  <span key={bet} className={css.gameboard_groupBtnSpan}>
                    { bet }
                  </span>
                );
              })
            }
          </span>
        </button>
      );
    });
  }
  renderSection(section) {
    const { thisMethodSetting, thisBetObj, onBetClick, thisMethodPrizeSetting } = this.props;
      const { prizeSettings } = thisMethodPrizeSetting;
    const { gameRules } = thisMethodSetting;
    const { set } = gameRules;
    
    if (_.isArray(set) && thisMethodPrizeSetting) {
      return _.map(set, (bet) => {
        let betPrize = '';
        if (prizeSettings && prizeSettings.length > 1) {
          const { symbolic } = thisMethodPrizeSetting;
          const symbolicName = TYPE[`SYMBOLIC_${symbolic}`];
          if (symbolicName) {
            if (bet === symbolicName) {
              betPrize = _.find(prizeSettings, (p) => (
                p.prizeNameForDisplay.indexOf('当年肖') > -1 ||
                p.prizeNameForDisplay.indexOf(bet) > -1
              ));
            } else {
              betPrize = _.find(prizeSettings, (p) => (
                (
                  p.prizeNameForDisplay.indexOf('当年肖') < 0 &&
                  p.prizeNameForDisplay.indexOf(symbolicName) < 0
                ) ||
                p.prizeNameForDisplay.indexOf(bet) > -1 ||
                p.prizeNameForDisplay.indexOf('非当年肖') > -1
              ));
            }
          } else {
            betPrize = _.find(prizeSettings, ['prizeNameForDisplay', bet]);
          }
        }
        const btnProps = {
          style: betPrize ? { marginBottom: '1.5rem' } : {},
          className: css.gameboard_btn,
          onClick: onBetClick.bind(this, { section, bet }),
          key: `${section}__${bet}`,
          'data-active': thisBetObj[section] && thisBetObj[section].indexOf(bet) > -1
        };
        
        return (
          <button {...btnProps}>
            { bet }
            {
              betPrize ? 
              <span className={css.gameboard_btnPrize}>{ betPrize.prizeAmount }</span>
              : null
            }
          </button>
        );
      });
    }
    return this.renderArrayBtn(section, set);
  }
  render() {
    const { thisMethodSetting, thisMethodPrizeSetting } = this.props;
    const { gameRules } = thisMethodSetting;
    const { sections } = gameRules;
    if (thisMethodPrizeSetting && thisMethodSetting) {
      return (
        <div className={css.gameboard}>
          {
            _.map(sections, (section) => {
              return (
                <div className={css.gameboard_section} key={section}>
                  <span className={css.gameboard_sectionLabel}>{ section }</span>
                  <div className={css.gameboard_btns}>
                    { this.renderSection(section) }
                  </div>
                  <div className={css.gameboard_ctrlBtns}>
                    { this.renderControllerBtns(section) }
                  </div>
                </div>
              );
            })
          }
        </div>
      );
    } return null;
  }
}

export default Gameboard;
