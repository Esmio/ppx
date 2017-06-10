import React, { Component } from 'react';
import { connect } from 'dva';
import { Pagination, Dropdown, Tooltip } from 'antd';
import ClipboardButton from 'react-clipboard.js';
import { MDIcon } from '../../General';
import { addCommas, type as TYPE } from '../../../utils';
import css from '../../../styles/User/profile.less';
import { accentCinnabar, accentTeal } from '../../../styles/variables.less';

const { transactionStateRefs } = TYPE;
const alignRight = { textAlign: 'right' };

const ellipsis = {
  width: '20%',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  sorting: '',
  sortingTarget: ''
};

class OrderRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentList: [],
      tooltipText: '点我复制到剪贴板'
    };
    this.dispatch = this.props.dispatch.bind(this);
    this.onCopySuccess = this.onCopySuccess.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.onPageSizeChange = this.onPageSizeChange.bind(this);
    this.onToolTipVisibleChange = this.onToolTipVisibleChange.bind(this);
    this.renderBetString = this.renderBetString.bind(this);
  }
  componentWillMount() {
    this.dispatch({ type: 'recordModel/getOrderHistory' });
  }
  componentWillReceiveProps(nextProps) {
    this.sliceList(nextProps);
    if (nextProps.state !== this.props.state) {
      this.dispatch({
        type: 'recordModel/initializeState',
        payload: ['orderInfo', 'subOrders']
      });
    }
  }
  componentWillUnmount() {
    this.dispatch({
      type: 'recordModel/initializeState',
      payload: ['pageSize', 'currentPage', 'state', 'orderInfo', 'subOrders', 'orderHistory']
    });
  }
  onTransactionSelect(transactionTimeuuid) {
    this.dispatch({ type: 'recordModel/updateState', payload: { transactionTimeuuid } });
    this.dispatch({ type: 'recordModel/getOrderDetails' });
  }
  onPopUpClose() {
    this.dispatch({
      type: 'recordModel/initializeState',
      payload: ['orderInfo', 'subOrders']
    });
  }
  onPageSizeChange(currentPage, pageSize) {
    this.dispatch({ type: 'recordModel/updateState', payload: { pageSize, currentPage } });
    this.dispatch({ type: 'recordModel/getOrderHistory' });    
  }
  onPageChange(currentPage) {
    const { orderHistory, pageSize } = this.props;
    const lastPage = Math.round(orderHistory.length / pageSize);
    this.dispatch({ type: 'recordModel/updateState', payload: { currentPage } });
    if (currentPage >= lastPage) {
      this.dispatch({ type: 'recordModel/getOrderHistory' });
    }
  }
  onStateChange(state) {
    this.dispatch({ type: 'recordModel/updateState', payload: { state, currentPage: 1 } });
    this.dispatch({ type: 'recordModel/getOrderHistory' });    
  }
  onCopySuccess() { this.setState({ tooltipText: '复制成功！' }); }
  onToolTipVisibleChange() { this.setState({ tooltipText: '点我复制到剪贴板' }); }
  onSortChange({ direction, target }) {
    const { sorting, sortingTarget } = this.state;
    if (sorting === direction && sortingTarget === target) {
      this.setState({ sorting: '' });
    } else {
      this.setState({ sorting: direction, sortingTarget: target }); 
    }
    this.dispatch({ type: 'recordModel/getOrderHistory' });
  }
  sliceList({ orderHistory, pageSize, currentPage }) {
    const { sorting, sortingTarget } = this.state;
    let currentList = [...orderHistory];
    if (orderHistory) {
      if (sorting === 'up') {
        currentList = _.sortBy([...currentList], [sortingTarget]);
      } else if (sorting === 'down') {
        currentList = _.reverse(_.sortBy([...currentList], [sortingTarget]));
      }
      const start = (currentPage - 1) * pageSize;
      const end = currentPage * pageSize;
      currentList = _.slice([...currentList], start, end);
      this.setState({ currentList });
    }
  }
  renderTableBody() {
    const { currentList } = this.state;
    if (currentList.length) {
      return _.map(currentList, (listItem) => {
        const {
          transactionTimeuuid, gameNameInChinese, gameIssueNo,
          transactionAmount, rebate, bettingTime, transactionState,
          totalUnits, winAmount
        } = listItem;
        let amountColor = '';
        if (transactionState === 'WIN') {
          amountColor = accentTeal;
        } else if (transactionState === 'LOSS') {
          amountColor = accentCinnabar;          
        }
        return (
          <tr key={transactionTimeuuid}>
            <td>
              <a
                onClick={this.onTransactionSelect.bind(this, transactionTimeuuid)}
                className={css.profile_tableAnchor}
              >
                { gameNameInChinese }
              </a>
            </td>
            <td>{ bettingTime }</td>
            <td>{ gameIssueNo }</td>
            <td style={alignRight}>{ totalUnits }</td>
            <td style={alignRight}>{ rebate || '-' }</td>
            <td style={alignRight}>{ addCommas(transactionAmount) }元</td>
            <td style={{ ...alignRight, color: amountColor }}>
              { transactionStateRefs[transactionState] }
              { transactionState === 'WIN' ? ` ${addCommas(winAmount)}元` : ''}
            </td>
          </tr>
        );
      });
    }
    return (
      <tr>
        <td colSpan="7">暂无数据</td>
      </tr>
    );
  }
  renderPagination() {
    const { orderHistory, currentPage, pageSize } = this.props;
    const totalLength = orderHistory.length || 0;
    return (
      <Pagination
        defaultCurrent={currentPage}
        defaultPageSize={pageSize}
        onChange={this.onPageChange}
        onShowSizeChange={this.onPageSizeChange}
        showQuickJumper
        showSizeChanger
        total={totalLength}
      />
    );
  }
  renderStateDropdown() {
    const { state } = this.props;
    return (
      <ul className={css.profile_dropdownMenu}>
        {
          _.map(transactionStateRefs, (typeValue, typeKey) => {
            const btnClass = typeKey === state ?
              css.profile_dropdownMenuItem__active : css.profile_dropdownMenuItem;
            return (
              <button
                onClick={this.onStateChange.bind(this, typeKey)}
                key={typeKey}
                className={btnClass}
              >{ typeValue }</button>
            );
          })
        }
      </ul>
    );
  }
  renderBetString(perBetUnits) {
    return (
      <ul className={css.profile_dropdownMenu}>
        {
          _.map(perBetUnits, (betStrings, index) => {
            const { betString, bonus } = betStrings;
            return (
              <li
                key={`${betString}-${index}`}
                className={css.profile_dropdownMenuItem__diff}
              >
                <span>{ betString }</span>
                {
                  bonus ?
                  <span style={{ color: accentTeal, marginLeft: '0.5rem' }}>
                    { `中奖 ${addCommas(bonus)}元` }
                  </span> : null
                }
              </li>
            );
          })
        }
      </ul>
    );
  }
  renderSubOrder() {
    const { subOrders } = this.props;
    if (subOrders) {
      return _.map(subOrders, (order, index) => {
        const {
          gameMethodInChinese, transactionState, perBetUnits,
          perBetUnit, bettingAmount, totalUnits, winningAmount,
          betString
        } = order;
        const truncatedBetString = _.truncate(betString, {
          length: '24'
        });
        let amountColor = '';
        if (transactionState === 'WIN') {
          amountColor = accentTeal;
        } else if (transactionState === 'LOSS') {
          amountColor = accentCinnabar;          
        }
        return (
          <tr key={`${betString}-${index}`}>
            <td>{ gameMethodInChinese }</td>
            <td >
              <Dropdown
                trigger={['click']}
                overlay={this.renderBetString(perBetUnits)}
              >
                <a className={css.profile_tableAnchor}>{truncatedBetString}</a>
              </Dropdown>
            </td>
            <td style={alignRight}>{ addCommas(perBetUnit) }元</td>
            <td style={alignRight}>{ totalUnits }</td>
            <td style={alignRight}>{ bettingAmount }</td>
            <td style={{ ...alignRight, color: amountColor }}>
              { transactionStateRefs[transactionState] }
              { winningAmount ? ` ${addCommas(winningAmount)}元` : ''}
            </td>
          </tr>
        );
      });
    } return <tr><td colSpan="6">暂无数据</td></tr>;
  }
  renderTablePopUp() {
    const { orderInfo, allGameInfos } = this.props;
    if (orderInfo) {
      const {
        gameNameInChinese, gameUniqueId, transactionTimeuuid,
        transactionAmount, gameIssueNo, rebate, winningAmount,
        bettingTime, transactionState, drawNumber
      } = orderInfo;
      let amountColor = '';
      if (transactionState === 'WIN') {
        amountColor = accentTeal;
      } else if (transactionState === 'LOSS') {
        amountColor = accentCinnabar;          
      }
      const idArray = _.split(transactionTimeuuid, '-');
      const lastIdString = idArray[idArray.length - 1];
      const firstIdString = idArray[0];
      const { gameIconUrl } = _.find(allGameInfos, ['gameUniqueId', gameUniqueId]);
      return (
        <div className={css.profile_tablePopUp}>
          <button
            onClick={this.onPopUpClose.bind(this)}
            className={css.profile_popUpCloseBtn}
          >
            关闭窗口
          </button>
          <div className={css.profile_popUpHeader}>
            <img
              className={css.profile_tablePopUpGamePic}
              src={gameIconUrl} alt={gameNameInChinese}
            />
            <h4 className={css.profile_popUpHeadline}>
              { gameNameInChinese }<br />
            </h4>
            <p className={css.profile_popUpSubHeadline}>
              第<strong>{gameIssueNo}</strong>期开奖号
              <em className={css.profile_popUpOpenNo}>{drawNumber || '未开奖'}</em>
            </p>
          </div>
          <div className={css.profile_popUpBody}>
            <div className={css.profile_popUpInlineInfo}>
              <h5 className={css.profile_popUpInfoLabel}>单注金额</h5>
              <p className={css.profile_popUpInfoContent}>{addCommas(transactionAmount)}元</p>
            </div>
            <div className={css.profile_popUpInlineInfo}>
              <h5 className={css.profile_popUpInfoLabel}>期号</h5>
              <p className={css.profile_popUpInfoContent}>{gameIssueNo}</p>
            </div>
            <div className={css.profile_popUpInlineInfo}>
              <h5 className={css.profile_popUpInfoLabel}>状态</h5>
              <p className={css.profile_popUpInfoContent} style={{ color: amountColor }}>
                {transactionStateRefs[transactionState]}
                { winningAmount ? ` ${addCommas(winningAmount)}元` : ''}
              </p>
            </div>
            <div className={css.profile_popUpInlineInfo}>
              <h5 className={css.profile_popUpInfoLabel}>下注时间</h5>
              <p className={css.profile_popUpInfoContent}>{ bettingTime }</p>
            </div>
              <ClipboardButton
                onSuccess={this.onCopySuccess}
                data-clipboard-text={transactionTimeuuid}
                className={css.profile_popUpInlineInfo}
              >
                <Tooltip
                  title={this.state.tooltipText}
                  onVisibleChange={this.onToolTipVisibleChange}
                >
                  <h5 className={css.profile_popUpInfoLabel}>注单号</h5>
                  <p className={css.profile_popUpInfoContent}>
                    <a className={css.profile_tableAnchor}>
                      <i>{firstIdString}</i>
                      <MDIcon iconName="multiplication" />
                      <MDIcon iconName="multiplication" />
                      <MDIcon iconName="multiplication" />
                      <MDIcon iconName="multiplication" />
                      <i>{ lastIdString }</i>
                    </a>
                  </p>
                </Tooltip>
              </ClipboardButton>
            <div className={css.profile_popUpInlineInfo}>
              <h5 className={css.profile_popUpInfoLabel}>返点</h5>
              <p className={css.profile_popUpInfoContent}>{ rebate || '-' }</p>
            </div>
          </div>
          <table className={css.profile_table}>
            <thead>
              <tr>
                <td width="15%">游戏玩法</td>
                <td
                  width="30%"
                  style={ellipsis}
                >下注号码</td>
                <td style={alignRight} width="15%">单注金额</td>
                <td style={alignRight} width="10%">注数</td>
                <td style={alignRight} width="15%">投注额</td>
                <td style={alignRight} width="15%">
                  { transactionStateRefs[transactionState] }
                  { winningAmount ? ` ${addCommas(winningAmount)}元` : ''}
                </td>
              </tr>
            </thead>
            <tbody>
              { this.renderSubOrder() }
            </tbody>
          </table>
        </div>
      );
    } return null;
  }
  render() {
    const { sorting, sortingTarget } = this.state;
    const { state } = this.props; 
    return (
      <div>
        <div className={css.profile_contentBody}>
          <h4 className={css.profile_formLabel}>投注记录</h4>
          <div className={css.profile_popUpBody}>
            { this.renderTablePopUp() }
            <table className={css.profile_table}>
              <thead>
                <tr>
                  <td>彩种</td>
                  <td>投注时间</td>
                  <td>期号</td>
                  <td style={alignRight}>注数</td>
                  <td style={alignRight}>返点</td>
                  <td style={alignRight}>
                    <i style={{ marginRight: '0.5rem' }}>投注总额</i>
                    <button
                      onClick={
                        this.onSortChange.bind(this, {
                          direction: 'up', target: 'transactionAmount'
                        })
                      }
                    >
                      <MDIcon
                        iconName="arrow-up"
                        className={
                          (sorting === 'up' && sortingTarget === 'transactionAmount') ?
                          css.profile_tableSortIcon__active : css.profile_tableSortIcon
                        }  
                      />
                    </button>
                    <button
                      onClick={
                        this.onSortChange.bind(this, {
                          direction: 'down', target: 'transactionAmount'
                        })
                      }
                    >
                      <MDIcon
                        iconName="arrow-down"
                        className={
                          (sorting === 'down' && sortingTarget === 'transactionAmount') ?
                          css.profile_tableSortIcon__active : css.profile_tableSortIcon
                        }                    
                      />
                    </button>
                  </td>
                  <td style={alignRight}>
                    <Dropdown overlay={this.renderStateDropdown()}>
                      <button>
                        <i>
                          {state === 'ALL' ? '开奖状态' : transactionStateRefs[state]}
                        </i>
                        <MDIcon 
                          iconName="menu-down"
                          className={css.profile_tableMenuDownIcon}
                        />
                      </button>
                    </Dropdown>
                    <button
                      onClick={
                        this.onSortChange.bind(this, {
                          direction: 'up', target: 'winAmount'
                        })
                      }
                    >
                      <MDIcon
                        iconName="arrow-up"
                        className={
                          (sorting === 'up' && sortingTarget === 'winAmount') ?
                          css.profile_tableSortIcon__active : css.profile_tableSortIcon
                        }  
                      />
                    </button>
                    <button
                      onClick={
                        this.onSortChange.bind(this, {
                          direction: 'down', target: 'winAmount'
                        })
                      }
                    >
                      <MDIcon
                        iconName="arrow-down"
                        className={
                          (sorting === 'down' && sortingTarget === 'winAmount') ?
                          css.profile_tableSortIcon__active : css.profile_tableSortIcon
                        }                    
                      />
                    </button>
                  </td>
                </tr>
              </thead>
              <tbody>
                { this.renderTableBody() }
              </tbody>
            </table>
          </div>
        </div>
        { this.renderPagination() }
      </div>
    );
  }
}

const mapStatesToProps = ({ recordModel, gameInfosModel }) => {
  const { gameInfosHot, gameInfosRecommend } = gameInfosModel;
  const allGameInfos = [...gameInfosHot, ...gameInfosRecommend];
  return { ...recordModel, allGameInfos };
};

export default connect(mapStatesToProps)(OrderRecord);
