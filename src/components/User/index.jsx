import React, { Component } from 'react';
import { Popconfirm } from 'antd';
import { connect } from 'dva';
import { PageContainer, MDIcon } from '../General';
import { type as TYPE } from '../../utils';
import AllRecord from './MyInfo/AllRecord';
import BankCardInfo from './MyInfo/BankCardInfo';
import BasicInfo from './MyInfo/BasicInfo';
import css from '../../styles/User/profile.less';
import OrderExpensesRecord from './MyInfo/OrderExpensesRecord';
import Authentication from './Authentication';
import OrderRecord from './MyInfo/OrderRecord';
import SecurityInfo from './MyInfo/SecurityInfo';
import TopUpContent from './MyInfo/Topup';
import WinningRecord from './MyInfo/WinningRecord';
import WithdrawalContent from './MyInfo/Withdrawal';
import TopupRecord from './MyInfo/TopupRecord';
import WithdrawalRecord from './MyInfo/WithdrawalRecord';

class UserIndex extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      previousSelectedNav: 'basicInfo',
      modalIsVisible: false
    };
    this.dispatch = this.props.dispatch.bind(this);
  }
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'userModel/getAccessToken' });
    this.bodyScrollHandler(this.props);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.profileSelectedNav !== this.props.profileSelectedNav) {
      this.setState({ previousSelectedNav: this.props.profileSelectedNav });
    }
    if (
      nextProps.shouldShowProfileModal !== this.props.shouldShowProfileModal ||
      nextProps.shouldShowAuthModel !== this.props.shouldShowAuthModel
    ) {
      this.bodyScrollHandler(nextProps);    
    }
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'layoutModel/selectUserProfileNav', payload: 'withdrawal' });        
  }
  onModalCancel() {
    this.setState({ modalIsVisible: false });
  }
  onNavSelect(profileSelectedNav) {
    const { dispatch } = this.props;
    dispatch({ type: 'layoutModel/updateState', payload: { profileSelectedNav } });
    dispatch({ type: 'formModel/initializeState', payload: ['responseMsg'] });
    dispatch({ type: 'orderModel/clearOrderDetails' });
  }
  onNavEnter(profileExpandedNav) {
    const { dispatch } = this.props;
    dispatch({
      type: 'layoutModel/updateState', payload: { profileExpandedNav }
    });
  }
  onAddBankClick() {
    const { dispatch } = this.props;
    dispatch({
      type: 'userModel/initializeState',
      payload: ['selectedBankCardId']
    });
    dispatch({
      type: 'formModel/initializeState',
      payload: [
        'bankCardExist', 'bankAccountName', 'bankName', 'bankCode',
        'bankAddress', 'bankCardNo', 'remarks'
      ]
    });
  }
  onNavLeave() {
    const { dispatch, profileSelectedNav } = this.props;
    const groupName = _.findKey(TYPE.userProfileNavs, (group) => {
      return _.findKey(group, (navs) => {
        return _.hasIn(navs, ['subNavs', profileSelectedNav]);
      });
    });
    const profileExpandedNav = _.findKey(TYPE.userProfileNavs[groupName], (navs) => {
      return _.hasIn(navs, ['subNavs', profileSelectedNav]);
    });
    dispatch({ type: 'layoutModel/updateState', payload: { profileExpandedNav } });
  }
  onPaymentGroupHover(topupType) {
    this.dispatch({
      type: 'transferModel/updateState', payload: { topupType }
    });
  }
  onPaymentGroupLeave() {
    const { paymentList, adminBankId } = this.props;
    if (adminBankId) {
      this.dispatch({ type: 'transferModel/updateState', payload: { topupType: 'BANK' } });
    } else {
      const selectedPayment = _.find(paymentList, ['paymentId', this.props.paymentId]);
      if (selectedPayment) {
        const topupType = selectedPayment.type;
        this.dispatch({ type: 'transferModel/updateState', payload: { topupType } });
      }
    }
  }
  onBackClick() {
    this.onNavSelect(this.state.previousSelectedNav);
  }
  onBankCardSelect(id) {
    const { dispatch } = this.props; 
    dispatch({
      type: 'userModel/updateState',
      payload: { selectedBankCardId: id }
    });
    dispatch({ type: 'formModel/initializeState', payload: ['responseMsg'] });
    dispatch({ type: 'formModel/getBankCardDetails' });
  }
  onAutoTopupSelect({ paymentId, type, paymentType, merchantName, dataImg }) {
    this.initializeTopupStatus();
    this.dispatch({
      type: 'transferModel/updateState',
      payload: {
        merchantName,
        paymentId,
        paymentType,
        topupType: type,
        dataImg
      }
    });
  }
  onManualTopupSelect(bankOption) {
    const { adminBankId } = bankOption;
    this.initializeTopupStatus();
    const neededFormData = _.pick(
      bankOption,
      ['bankName', 'bankCardNo', 'receiptName', 'bankAddress', 'remarks']
    );
    const formValues = _.mapValues(neededFormData, (data) => {
      return { value: data };
    });
    this.dispatch({ type: 'transferModel/updateState', payload: { adminBankId } });
    this.dispatch({ type: 'formModel/updateState', payload: { ...formValues } });
  }
  onBgClick() {
    const { dispatch } = this.props;
    dispatch({
      type: 'layoutModel/updateState',
      payload: {
        shouldShowProfileModal: false,
        shouldShowAuthModel: false
      }
    });
    dispatch({ type: 'formModel', payload: 'responseMsg' });
    dispatch({
      type: 'layoutModel/initializeState', payload: ['profileSelectedNav']
    });
  }
  initializeTopupStatus() {
    this.dispatch({
      type: 'transferModel/initializeState',
      payload: [
        'adminBankId', 'merchantName', 'paymentId', 'paymentType', 'topupType',
        'dataImg', 'data', 'webview', 'paymentMethod', 'transactionId', 'amount',
        'paymentPlatformCode'
      ]
    });
    this.dispatch({
      type: 'formModel/initializeState',
      payload: [
        'bankName', 'bankCardNo', 'receiptName', 'bankAddress', 'remarks', 'responseMsg',
        'topupAmount', 'transferToupType', 'topupCardRealname', 'topupTime'
      ]
    });
  }
  bodyScrollHandler({ shouldShowProfileModal, shouldShowAuthModel }) {
    const body = document.body;
    body.style.overflow = (shouldShowProfileModal || shouldShowAuthModel) ? 'hidden' : 'auto';
  }
  logoutHandler() {
    const { dispatch } = this.props;
    dispatch({ type: 'layoutModel/updateState', payload: { shouldShowProfileModal: false } });
    dispatch({
      type: 'userModel/getUserLogout',
    });
    this.setState({ modalIsVisible: false });    
  }
  renderContent() {
    const { profileSelectedNav } = this.props;
    switch (profileSelectedNav) {
      case 'basicInfo':
        return <BasicInfo />;
      case 'securityInfo':
        return <SecurityInfo />;
      case 'bankInfo':
        return <BankCardInfo />;
      case 'topup':
        return <TopUpContent />;
      case 'withdrawal':
        return <WithdrawalContent />;
      case 'allRecord':
        return <AllRecord />;
      case 'orderRecord':
        return <OrderRecord />;
      case 'orderExpensesRecord':
        return <OrderExpensesRecord />;
      case 'winningRecord':
        return <WinningRecord />;
      case 'topupRecord':
        return <TopupRecord />;
      case 'withdrawalRecord':
        return <WithdrawalRecord />;
      default:
        return null;
    }
  }
  renderBankCards() {
    const { bankAccounts, selectedBankCardId } = this.props;
    if (bankAccounts.length > 0) {
      return (
        _.map(bankAccounts, (bankCard) => {
          const { bankName, bankCardNo, id } = bankCard;
          const bankInfo = _.find(TYPE.banksOptions, ['displayName', bankName]);
          const btnActive = selectedBankCardId === id;
          const { website } = bankInfo;
          const listItemClass = btnActive ?
            css.profile_bankCard__active : css.profile_bankCard;
          const cardFourDigit = bankCardNo.substring(bankCardNo.length - 4, bankCardNo.length);
          return (
            <button
              key={id}
              disabled={btnActive}
              onClick={this.onBankCardSelect.bind(this, id)}
              className={listItemClass}
            >
              <img
                className={css.profile_bankFavicon} height="18px" width="18px"
                src={`http://www.google.com/s2/favicons?domain=${website}`} alt={bankName}
              />
              <span className={css.profile_bankName}>
                {bankName} - <strong>{ cardFourDigit }</strong>
              </span>
            </button>
          );
        })
      );
    }
    return (
      <p className={css.profile_emptyListMsg}>尚未添加银行卡</p>
    );
  }
  renderAutoPayListItem({
    paymentKey, paymentName, list, subNavsClass, navItemClass
  }) {
    return (
      <div
        key={paymentKey}
        onMouseEnter={this.onPaymentGroupHover.bind(this, paymentKey)}
      >
        <button className={navItemClass}>
          <i className={css[`profile_paymentIcon__${paymentKey}_PAY`]} />
          <i>{ paymentName }</i>
          <MDIcon iconName="chevron-down" className={css.profile_sideNavChevron} />
        </button>
        <div className={subNavsClass}>
          {
            _.map(list, (option) => {
              const {
                paymentId, merchantName, bankCode, receiptName, adminBankId, bankCardNo
              } = option;
              const isOddItem = bankCode === 'ZHB' || bankCode === 'WX';
              const notWAP = bankCode !== 'WAP';
              const subNavItemClass = (adminBankId || paymentId) === this.props.paymentId ?
                css.profile_sideSubNavItem__active : css.profile_sideSubNavItem;
              if (isOddItem) {
                const oddOption = {
                  paymentId: paymentId || adminBankId,
                  type: paymentKey,
                  paymentType: 'SCAN',
                  merchantName: receiptName,
                  dataImg: bankCardNo
                };
                return (
                  <button
                    key={paymentId || adminBankId}
                    onClick={this.onAutoTopupSelect.bind(
                      this, oddOption
                    )}                          
                    className={subNavItemClass} 
                  >
                    {receiptName}
                  </button>
                );
              } else if (notWAP) {
                return (
                  <button
                    key={paymentId || adminBankId}
                    onClick={this.onAutoTopupSelect.bind(this, option)}                          
                    className={subNavItemClass} 
                  >
                    {merchantName}
                  </button>
                );
              }
            })
          }
        </div>
      </div>
    );
  }
  renderManualPayListItem({
    paymentKey, paymentName, list, subNavsClass, navItemClass
  }) {
    return (
      <div
        key={paymentKey}
        onMouseEnter={this.onPaymentGroupHover.bind(this, paymentKey)}
      >
        <button className={navItemClass}>
          <i className={css[`profile_paymentIcon__${paymentKey}_PAY`]} />
          <i>{ paymentName }</i>
          <MDIcon iconName="chevron-down" className={css.profile_sideNavChevron} />
        </button>
        <div className={subNavsClass}>
          {
            _.map(list, (option) => {
              const { bankName, adminBankId, receiptName, bankCode } = option;
              const isOddItem = bankCode === 'ZHB' || bankCode === 'WX';              
              const subNavItemClass = adminBankId === this.props.adminBankId ?
                css.profile_sideSubNavItem__active : css.profile_sideSubNavItem;
              
              return (isOddItem ? null : 
                <button
                  onClick={this.onManualTopupSelect.bind(this, option)}                          
                  key={adminBankId}
                  className={subNavItemClass} 
                >
                  <span>{bankName}</span><br />
                  <em>{ receiptName }</em>
                </button>
              );
            })
          }
        </div>
      </div>
    );
  }
  renderTopupList() {
    const { paymentTypeRefs } = TYPE;
    const { paymentList, bankList } = this.props;
    return _.map(paymentTypeRefs, (paymentName, paymentKey) => {
      const list = _.filter(paymentList, ['type', paymentKey]);
      const oddObjects = _.filter(bankList, ['bankCode', paymentKey]);
      const completeList = [...list, ...oddObjects];
      const subNavsClass = this.props.topupType === paymentKey ?
            css.profile_sideSubNavs__expanded : css.profile_sideSubNavs;
      const navItemClass = this.props.topupType === paymentKey ? 
            css.profile_sideNavItem__active : css.profile_sideNavItem;
      if (paymentKey === 'BANK') {
        return this.renderManualPayListItem({
          paymentName, paymentKey, list: bankList, subNavsClass, navItemClass
        });
      }
      return this.renderAutoPayListItem({
        paymentName, paymentKey, list: completeList, subNavsClass, navItemClass
      });
    });
  }
  renderSecondaryList() {
    const { profileSelectedNav } = this.props;
    switch (profileSelectedNav) {
      case 'bankInfo':
        return (
          <div className={css.profile_secondaryList__visible}>
            <button className={css.profile_listBackBtn} onClick={this.onBackClick.bind(this)}>
              <MDIcon iconName="keyboard-backspace" /><i>返回</i>
            </button>
            { this.renderBankCards() }
            <button
              className={css.profile_listAddCardBtn}
              onClick={this.onAddBankClick.bind(this)}
            >
              <MDIcon iconName="credit-card-plus" />
              <i>添加银行卡</i>
            </button>
          </div>
        );
      case 'topup':
        return (
          <div
            className={css.profile_secondaryList__visible}
            onMouseLeave={this.onPaymentGroupLeave.bind(this)}
          >
            <button className={css.profile_listBackBtn} onClick={this.onBackClick.bind(this)}>
              <MDIcon iconName="keyboard-backspace" /><i>返回</i>
            </button>
            { this.renderTopupList() }
          </div>
        );
      default:
        return (
          <div className={css.profile_secondaryList} />
        );
    }
  }
  renderSubNavItem({ subNavs, sideSubNavsClass }) {
    const { profileSelectedNav } = this.props;
    return (
      <div className={sideSubNavsClass}>
        {
          _.map(subNavs, (subNav, subNavKey) => {
            const subNavClass = profileSelectedNav === subNavKey ?
              css.profile_sideSubNavItem__active : css.profile_sideSubNavItem;
            return (
              <button
                onClick={this.onNavSelect.bind(this, subNavKey)}                          
                key={subNavKey}
                className={subNavClass} 
              >
                {subNav}
              </button>
            );
          })
        }
      </div>
    );
  }
  renderSideNav() {
    const { profileExpandedNav, userData } = this.props;
    const { nickname, username } = userData;
    const name = nickname || username;   
    return (
      <div>
        {
          _.map(TYPE.userProfileNavs, (groupNav, groupName) => {
            return (
              <div key={groupName} className={css.profile_sideNavGroup}>
                <h6 className={css.profile_sideNavLabel}>{groupName}</h6>
                {
                  _.map(groupNav, (nav, navKey) => {
                    const { displayName, icon, subNavs } = nav;
                    const sideSubNavsClass = profileExpandedNav === navKey ?
                      css.profile_sideSubNavs__expanded : css.profile_sideSubNavs;
                    return (
                      <div
                        onMouseEnter={this.onNavEnter.bind(this, navKey)}
                        onMouseLeave={this.onNavLeave.bind(this, groupName)}
                        key={navKey}
                      >
                        <button
                          className={
                            profileExpandedNav === navKey ? 
                            css.profile_sideNavItem__active : css.profile_sideNavItem
                          }
                        >
                          <MDIcon
                            iconName={icon} className={css.profile_sideNavItemIcon}
                          />
                          <span>{ displayName }</span>
                          <MDIcon
                            iconName="chevron-down" className={css.profile_sideNavChevron}
                          />
                        </button>
                        { subNavs ? this.renderSubNavItem({ subNavs, sideSubNavsClass }) : null }
                      </div>
                    );
                  })
                }
              </div>
            );
          })
        }
        { this.renderSecondaryList() }
        <Popconfirm
          title={`${name}您确定登出?`}
          onConfirm={this.logoutHandler.bind(this)}
          okText="确定" cancelText="取消"
        >
          <button
            className={css.profile_logoutBtn}
          >登出</button>
        </Popconfirm>
      </div>
    );
  }
  renderHeadline() {
    const { profileGroupNav, profileSelectedNav } = this.props;    
    const expandedNavKey = _.findKey(
      TYPE.userProfileNavs[profileGroupNav], (Obj) => {
        return _.hasIn(Obj, ['subNavs', profileSelectedNav]);
      }
    );
    const expandedNav = TYPE.userProfileNavs[profileGroupNav][expandedNavKey];
    const navDisplayName = expandedNav.displayName;
    const subNavDisplayName = expandedNav.subNavs[profileSelectedNav];
    if (expandedNav) {
      return (
        <p className={css.profile_contentHeadline}>
          { navDisplayName ? 
            <span>
              <em>{ navDisplayName }</em>
            </span> : null
          }
          { subNavDisplayName ?
            <span>
              <MDIcon iconName="chevron-right" />
              <em>{ subNavDisplayName }</em>
            </span> : null
          }
        </p>
      );
    }
  }
  renderScene() {
    const { userData, shouldShowProfileModal, shouldShowAuthModel } = this.props; 
    if (shouldShowAuthModel) {
      return (
        <div className={css.registerModel}>
          <Authentication />
        </div>
      );
    } else if (userData && shouldShowProfileModal) {
      return (
        <PageContainer className={css.profileModal}>
          <div className={css.profile_sideNav}>
            { this.renderSideNav() }
          </div>
          <div className={css.profile_content}>
            { this.renderHeadline() }
            { this.renderContent() }
          </div>
        </PageContainer>
      );
    }
    return null;
  }
  render() {
    const { shouldShowProfileModal, shouldShowAuthModel } = this.props;
    if (shouldShowProfileModal || shouldShowAuthModel) {
      return (
        <div>
          <div onClick={this.onBgClick.bind(this)} className={css.profileModal_overlay} />
          { this.renderScene() }
        </div>
      );
    }
    return null;
  }
}

const mapStatesToProps = ({ userModel, layoutModel, transferModel }) => {
  const { userData, selectedBankCardId, bankAccounts } = userModel;
  const {
    profileGroupNav, shouldShowProfileModal,
    profileSelectedNav, profileExpandedNav, shouldShowAuthModel
  } = layoutModel;
  return {
    ...transferModel,
    bankAccounts,
    profileExpandedNav,
    profileGroupNav,
    profileSelectedNav,
    selectedBankCardId,
    shouldShowProfileModal,
    shouldShowAuthModel,
    userData,
  };
};

export default connect(mapStatesToProps)(UserIndex);

