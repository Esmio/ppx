import React, { Component } from 'react';
import moment from 'moment';
import { Pagination, Tooltip, Dropdown } from 'antd';
import ClipboardButton from 'react-clipboard.js';
import _ from 'lodash';
import { connect } from 'dva';
import { addCommas, type as TYPE } from '../../../utils';
import { MDIcon } from '../../General';
import css from '../../../styles/User/profile.less';
import { accentCinnabar } from '../../../styles/variables.less';

const alignRight = { textAlign: 'right' };
const { transferStateRefs, transferTypeRefs, transferSubTypeRefs } = TYPE;

class WithdrawalRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentList: [],
      tooltipText: '点我复制到剪贴板',
      sorting: '',
      searchText: ''
    };
    this.dispatch = this.props.dispatch.bind(this);
    this.onCopySuccess = this.onCopySuccess.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.onPageSizeChange = this.onPageSizeChange.bind(this);
    this.onToolTipVisibleChange = this.onToolTipVisibleChange.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }
  componentWillMount() {
    this.dispatch({ type: 'recordModel/updateState', payload: { type: 'WITHDRAWAL' } });    
    this.dispatch({ type: 'recordModel/getTransactionHistory' });
  }
  componentWillReceiveProps(nextProps) {
    this.sliceList(nextProps);
  }
  componentWillUnmount() {
    this.dispatch({
      type: 'recordModel/initializeState',
      payload: ['type', 'subType', 'state', 'transactionHistory']
    });
  }
  onCopySuccess() { this.setState({ tooltipText: '复制成功！' }); }
  onToolTipVisibleChange() { this.setState({ tooltipText: '点我复制到剪贴板' }); }
  onPageSizeChange(currentPage, pageSize) {
    this.dispatch({ type: 'recordModel/updateState', payload: { pageSize, currentPage } });
    this.dispatch({ type: 'recordModel/getTransactionHistory' });    
  }
  onPageChange(currentPage) {
    const { transactionHistory, pageSize } = this.props;
    const lastPage = Math.round(transactionHistory.length / pageSize);
    this.dispatch({ type: 'recordModel/updateState', payload: { currentPage } });
    if (currentPage >= lastPage) {
      this.dispatch({ type: 'recordModel/getTransactionHistory' });
    }
  }
  onSubTypeChange(subType) {
    this.dispatch({ type: 'recordModel/updateState', payload: { subType, currentPage: 1 } });
    this.dispatch({ type: 'recordModel/getTransactionHistory' });    
  }
  onStateChange(state) {
    this.dispatch({ type: 'recordModel/updateState', payload: { state, currentPage: 1 } });
    this.dispatch({ type: 'recordModel/getTransactionHistory' });    
  }
  onSortChange(direction) {
    const { sorting } = this.state;
    if (sorting === direction) {
      this.setState({ sorting: '' });
    } else {
      this.setState({ sorting: direction }); 
    }
    this.dispatch({ type: 'recordModel/getTransactionHistory' });
  }
  onSearchChange(event) {
    if (event.target) {
      const { value } = event.target;
      this.setState({ searchText: value });
    }
  }
  onSearchClear() {
    this.setState({ searchText: '' });
    this.dispatch({ type: 'recordModel/getTransactionHistory' });
  }
  onSearchClick() { this.dispatch({ type: 'recordModel/getTransactionHistory' }); }
  sliceList({ transactionHistory, pageSize, currentPage }) {
    const { sorting, searchText } = this.state;
    let currentList = [...transactionHistory];
    if (transactionHistory) {
      if (sorting === 'up') {
        currentList = _.sortBy([...currentList], ['effectiveAmount']);
      } else if (sorting === 'down') {
        currentList = _.reverse(_.sortBy([...currentList], ['effectiveAmount']));
      }
      if (searchText) {
        currentList = _.reduce(currentList, (newList, listItem) => {
          const { transactionId } = listItem;
          if (transactionId.indexOf(searchText) >= 0) {
            newList.push(listItem);
          }
          return newList;
        }, []);
      }
      const start = (currentPage - 1) * pageSize;
      const end = currentPage * pageSize;
      currentList = _.slice([...currentList], start, end);
      this.setState({ currentList });
    }
  }
  renderPagination() {
    const { transactionHistory, currentPage, pageSize } = this.props;
    const totalLength = transactionHistory.length;
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
  renderTableBody() {
    const { currentList } = this.state;
    if (currentList.length) {
      return _.map(currentList, (listItem) => {
        const {
          createTime, transactionId, type, subType, state, effectiveAmount
        } = listItem;
        const idArray = _.split(transactionId, '-');
        const lastIdString = idArray[idArray.length - 1];
        const firstIdString = idArray[0];
        const isCompleted = state === 'COMPLETED';

        return (
          <tr key={transactionId}>
            <td>{ moment(createTime).format('DD-MM-Y')}</td>
            <td>
              <ClipboardButton
                onSuccess={this.onCopySuccess}
                data-clipboard-text={transactionId}
              >
                <Tooltip
                  title={this.state.tooltipText}
                  onVisibleChange={this.onToolTipVisibleChange}
                >
                  <a className={css.profile_tableAnchor}>
                    <i>{firstIdString}</i>
                    <MDIcon iconName="multiplication" />
                    <MDIcon iconName="multiplication" />
                    <MDIcon iconName="multiplication" />
                    <MDIcon iconName="multiplication" />
                    <i>{ lastIdString }</i>
                  </a>
                </Tooltip>
              </ClipboardButton>
            </td>
            <td>{ transferTypeRefs[type] }</td>
            <td>{ transferSubTypeRefs[subType] }</td>
            <td>{ transferStateRefs[state] }</td>
            <td style={{ ...alignRight, color: isCompleted ? accentCinnabar : '' }}>
              {isCompleted ? '-' : ''}{ addCommas(effectiveAmount) }元
            </td>
          </tr>
        );
      });
    }
    return (
      <tr>
        <td colSpan="6">暂无数据</td>
      </tr>
    );
  }
  renderSubTypeDropdown() {
    const { subType } = this.props;
    return (
      <ul className={css.profile_dropdownMenu}>
        {
          _.map(transferSubTypeRefs, (typeValue, typeKey) => {
            const btnClass = typeKey === subType ?
              css.profile_dropdownMenuItem__active : css.profile_dropdownMenuItem;
            const isUnrelated = typeKey.indexOf('TOPUP') >= 0 || typeKey === 'UNRECOGNIZED';
            return (
              isUnrelated ? null :
              <button
                onClick={this.onSubTypeChange.bind(this, typeKey)}
                key={typeKey}
                className={btnClass}
              >{ typeValue }</button>
            );
          })
        }
      </ul>
    );
  }
  renderStateDropdown() {
    const { state } = this.props;
    return (
      <ul className={css.profile_dropdownMenu}>
        {
          _.map(transferStateRefs, (typeValue, typeKey) => {
            const btnClass = typeKey === state ?
              css.profile_dropdownMenuItem__active : css.profile_dropdownMenuItem;
            const isUnrelated = typeKey.indexOf('TOPUP') >= 0 || typeKey === 'UNRECOGNIZED';
            return (isUnrelated ? null :
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
  render() {
    const { sorting, searchText } = this.state;
    const { state, subType } = this.props;
    return (
      <div>
        <div className={css.profile_contentBody}>
          <h4 className={css.profile_formLabel}>充值记录</h4>
          <table className={css.profile_table}>
            <thead>
              <tr>
                <td width="17%">交易时间</td>
                <td width="30%">
                  <div className={css.profile_tableSearchBox}>
                    <button onClick={this.onSearchClick.bind(this)}>
                      <MDIcon
                        className={
                          searchText ?
                          css.profile_tableSearchIcon__active : css.profile_tableSearchIcon
                        }
                        iconName="magnify"                   
                      />
                    </button>
                    <input
                      className={css.profile_tableSearchInput}
                      placeholder="收支单号"
                      value={searchText}
                      onChange={this.onSearchChange}
                    />
                    <button onClick={this.onSearchClear.bind(this)}>
                      <MDIcon
                        className={
                          searchText ?
                          css.profile_tableClearIcon__active : css.profile_tableClearIcon
                        }
                        iconName="close-circle"                   
                      />
                    </button>
                  </div>
                </td>
                <td width="12%">
                  交易类型
                </td>
                <td width="12%">
                  <Dropdown overlay={this.renderSubTypeDropdown()}>
                    <button>
                      <i>
                        {subType === 'ALL' ? '交易方式' : transferSubTypeRefs[subType]}
                      </i>
                      <MDIcon iconName="menu-down" className={css.profile_tableMenuDownIcon} />
                    </button>
                  </Dropdown>
                </td>
                <td width="15%">
                  <Dropdown overlay={this.renderStateDropdown()}>
                    <button>
                      <i>
                        {state === 'ALL' ? '交易状态' : transferStateRefs[state]}
                      </i>
                      <MDIcon iconName="menu-down" className={css.profile_tableMenuDownIcon} />
                    </button>
                  </Dropdown>
                </td>
                <td width="12%" style={alignRight}>
                  <i style={{ marginRight: '0.5rem' }}>交易金额</i>
                  <button onClick={this.onSortChange.bind(this, 'up')}>
                    <MDIcon
                      iconName="arrow-up"
                      className={
                        sorting === 'up' ?
                        css.profile_tableSortIcon__active : css.profile_tableSortIcon
                      }  
                    />
                  </button>
                  <button onClick={this.onSortChange.bind(this, 'down')}>
                    <MDIcon
                      iconName="arrow-down"
                      className={
                        sorting === 'down' ?
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
        { this.renderPagination() }
      </div>
    );
  }
}

const mapStatesToProps = ({ recordModel }) => {
  return { ...recordModel };
};

export default connect(mapStatesToProps)(WithdrawalRecord);
