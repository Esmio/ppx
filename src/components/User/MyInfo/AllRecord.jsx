import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { Pagination, Tooltip } from 'antd';
import ClipboardButton from 'react-clipboard.js';
import { connect } from 'dva';
import { addCommas } from '../../../utils';
import { MDIcon } from '../../General';
import css from '../../../styles/User/profile.less';
import { accentCinnabar, accentTeal } from '../../../styles/variables.less';

const alignRight = { textAlign: 'right' };

class AllRecord extends Component {
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
    this.dispatch({ type: 'recordModel/getMyDetails' });
  }
  componentWillReceiveProps(nextProps) {
    this.sliceList(nextProps);
  }
  componentWillUnmount() {
    this.dispatch({
      type: 'recordModel/initializeState',
      payload: ['pageSize', 'currentPage', 'state']
    });
  }
  onPageSizeChange(currentPage, pageSize) {
    this.dispatch({ type: 'recordModel/updateState', payload: { pageSize, currentPage } });
    this.dispatch({ type: 'recordModel/getMyDetails' });    
  }
  onSearchChange(event) {
    if (event.target) {
      const { value } = event.target;
      this.setState({ searchText: value });
    }
  }
  onSearchClear() {
    this.setState({ searchText: '' });
    this.dispatch({ type: 'recordModel/getMyDetails' });
  }
  onSearchClick() { this.dispatch({ type: 'recordModel/getMyDetails' }); }
  onCopySuccess() { this.setState({ tooltipText: '复制成功！' }); }
  onToolTipVisibleChange() { this.setState({ tooltipText: '点我复制到剪贴板' }); }
  onPageChange(currentPage) {
    const { allDetailsHistory, pageSize } = this.props;
    const lastPage = Math.round(allDetailsHistory.length / pageSize);
    this.dispatch({ type: 'recordModel/updateState', payload: { currentPage } });
    if (currentPage >= lastPage) {
      this.dispatch({ type: 'recordModel/getMyDetails' });     
    }
  }
  onSortChange(direction) {
    const { sorting } = this.state;
    if (sorting === direction) {
      this.setState({ sorting: '' });
    } else {
      this.setState({ sorting: direction }); 
    }
    this.dispatch({ type: 'recordModel/getMyDetails' });
  }
  sliceList({ allDetailsHistory, pageSize, currentPage }) {
    const { sorting, searchText } = this.state;
    let currentList = [...allDetailsHistory];
    if (allDetailsHistory) {
      if (sorting === 'up') {
        currentList = _.sortBy([...currentList], ['delta']);
      } else if (sorting === 'down') {
        currentList = _.reverse(_.sortBy([...currentList], ['delta']));
      }
      if (searchText) {
        currentList = _.reduce(currentList, (newList, listItem) => {
          const { crossReferenceId } = listItem;
          if (crossReferenceId.indexOf(searchText) >= 0) {
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
  renderTableBody() {
    const { currentList } = this.state;
    if (currentList.length) {
      return _.map(currentList, (listItem) => {
        const { createdTime, delta, crossReferenceId, type } = listItem;
        const deltaColor = delta < 0 ? accentCinnabar : accentTeal;
        const date = moment(createdTime * 1000).format('DD-MM-Y hh:mm:s');
        const idArray = _.split(crossReferenceId, '-');
        const lastIdString = idArray[idArray.length - 1];
        const firstIdString = idArray[0];
        return (
          <tr key={crossReferenceId}>
            <td>{ date }</td>
            <td>
              <ClipboardButton
                onSuccess={this.onCopySuccess}
                data-clipboard-text={crossReferenceId}
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
            <td>{ type }</td>
            <td style={{ ...alignRight, color: deltaColor }}>{ addCommas(delta) }元</td>
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
  renderPagination() {
    const { allDetailsHistory, currentPage, pageSize } = this.props;
    const totalLength = allDetailsHistory.length;
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
  render() {
    const { sorting, searchText } = this.state;
    return (
      <div>
        <div className={css.profile_contentBody}>
          <h4 className={css.profile_formLabel}>账户明细</h4>
          <table className={css.profile_table}>
            <thead>
              <tr>
                <td width="25%">时间</td>
                <td width="40%">
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
                <td width="10%">交易类型</td>
                <td width="25%" style={alignRight}>
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
  const { allDetailsHistory, currentPage, pageSize, start } = recordModel;
  return { allDetailsHistory, currentPage, pageSize, start };
};

export default connect(mapStatesToProps)(AllRecord);
