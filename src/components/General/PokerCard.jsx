import React, { Component } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { accentCinnabar } from '../../styles/variables.less';
import icons from '../../styles/iconfont.less';
import css from '../../styles/general/pokerCard.less';

export class PokerCard extends Component {
  constructor() {
    super();
    this.state = {
      size: 1
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ size: nextProps.size });
  }
  renderSymbol(symbolCode) {
    if (symbolCode) {
      return (
        <span
          className={classNames(css.pokerCard_symbol, icons[`POKER_NUM_${symbolCode}`])}
        />
      );
    }
    return (
      <span className={css.pokerCard_symbols}>
        <span className={classNames(css.pokerCard_symbol, icons.POKER_NUM_100)} />
        <span
          className={classNames(css.pokerCard_symbol, icons.POKER_NUM_200)}
          style={{ color: accentCinnabar }}
        />
        <span className={classNames(css.pokerCard_symbol, icons.POKER_NUM_300)} />
        <span
          className={classNames(css.pokerCard_symbol, icons.POKER_NUM_400)}
          style={{ color: accentCinnabar }}          
        />
      </span>
    );
  }
  renderNum(numCode) {
    if (numCode) {
      return (
        <span
          className={classNames(css.pokerCard_num, icons[`POKER_NUM_${numCode}`])}
        />
      );
    } return null;
  }
  renderMethodText() {
    const { methodText } = this.props;
    if (methodText) {
      return (
        <span className={css.pokerCard_method}>
          { methodText }
        </span>
      );
    } return null;
  }
  render() {
    const { pokerCode, color, backgroundColor } = this.props;
    const { size } = this.state;
    const height = `${size * 3}rem`;
    const width = `${size * 2.25}rem`;
    if (pokerCode && pokerCode.length) {
      return (
        <div className={css.pokerCards}>
          {
            _.map(pokerCode, (code) => {
              const symbolCode = _.floor(code, -2);
              const numCode = code - symbolCode;
              console.log(symbolCode, numCode);
              return (
                <div
                  key={code}
                  style={{ color, backgroundColor, fontSize: `${size}rem`, height, width }}
                  className={css.pokerCard} data-symbol={`${symbolCode}`}
                >
                  { this.renderMethodText() }
                  { this.renderNum(numCode) }
                  { this.renderSymbol(symbolCode) }
                </div>
              );
            })
          }
        </div>
      );
    } return null;
  }
}
