import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { Pagination, Tooltip } from 'antd';
import ClipboardButton from 'react-clipboard.js';
import { MDIcon } from '../../General';
import { addCommas } from '../../../utils';
import css from '../../../styles/User/profile.less';
import { accentCinnabar } from '../../../styles/variables.less';

const alignRight = { textAlign: 'right' };

class OrderExpensesRecord extends Component {
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
    this.dispatch({ type: 'recordModel/getOrderHistory' });
  }
  componentWillReceiveProps(nextProps) {
    this.sliceList(nextProps);
  }
  componentWillUnmount() {
    this.dispatch({
      type: 'recordModel/initializeState',
      payload: ['currentPage', 'pageSize', 'orderHistory']
    });
  }
  onSearchChange(event) {
    if (event.target) {
      const { value } = event.target;
      this.setState({ searchText: value });
    }
  }
  onSearchClear() {
    this.setState({ searchText: '' });
    this.dispatch({ type: 'recordModel/getOrderHistory' });
  }
  onSearchClick() { this.dispatch({ type: 'recordModel/getOrderHistory' }); }
  onCopySuccess() { this.setState({ tooltipText: '复制成功！' }); }
  onToolTipVisibleChange() { this.setState({ tooltipText: '点我复制到剪贴板' }); }
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
  onSortChange(direction) {
    const { sorting } = this.state;
    if (sorting === direction) {
      this.setState({ sorting: '' });
    } else {
      this.setState({ sorting: direction }); 
    }
    this.dispatch({ type: 'recordModel/getOrderHistory' });
  }
  sliceList({ orderHistory, pageSize, currentPage }) {
    const { sorting, searchText } = this.state;
    let currentList = [...orderHistory];
    if (orderHistory) {
      if (sorting === 'up') {
        currentList = _.sortBy([...currentList], ['transactionAmount']);
      } else if (sorting === 'down') {
        currentList = _.reverse(_.sortBy([...currentList], ['transactionAmount']));
      }
      if (searchText) {
        currentList = _.reduce(currentList, (newList, listItem) => {
          const { transactionTimeuuid } = listItem;
          if (transactionTimeuuid.indexOf(searchText) >= 0) {
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
    const { orderHistory, currentPage, pageSize } = this.props;
    const totalLength = orderHistory.length;
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
          transactionTimeuuid, transactionAmount, bettingTime,
        } = listItem;
        const idArray = _.split(transactionTimeuuid, '-');
        const lastIdString = idArray[idArray.length - 1];
        const firstIdString = idArray[0];
        return (
          <tr key={transactionTimeuuid}>
            <td>{ bettingTime }</td>
            <td>
              <ClipboardButton
                onSuccess={this.onCopySuccess}
                data-clipboard-text={transactionTimeuuid}
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
            <td>支出</td>
            <td>投注</td>
            <td
              style={{
                ...alignRight,
                color: accentCinnabar
              }}
            >-{ addCommas(transactionAmount) }元</td>
          </tr>
        );
      });
    }
    return (
      <tr>
        <td colSpan="5">暂无数据</td>
      </tr>
    );
  }
  render() {
    const { sorting, searchText } = this.state;
    return (
      <div>
        <div className={css.profile_contentBody}>
          <h4 className={css.profile_formLabel}>投注消费</h4>
          <table className={css.profile_table}>
            <thead>
              <tr>
                <td width="20%">投注时间</td>
                <td width="35%">
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
                <td width="15%">收支情况</td>
                <td width="15%">交易类型</td>
                <td style={alignRight} width="15%">
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

export default connect(mapStatesToProps)(OrderExpensesRecord);
