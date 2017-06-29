import React, { Component } from 'react';
import { connect } from 'dva';
import QRCode from 'qrcode.react';
import { MDIcon, OrangeButton, EllipsisLoader, LoadingBar } from '../../General';
import { type as TYPE, addCommas } from '../../../utils/';
import Input from '../ProfileInput';
import css from '../styles/ProfileIndex.less';

class TopUp extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      QRImageLoading: true
    };
    this.dispatch = this.props.dispatch.bind(this);
  }
  componentWillMount() {
    this.dispatch({ type: 'transferModel/getPaymentList' });
    this.dispatch({ type: 'transferModel/getBankList' });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.paymentList !== this.props.paymentList) {
      this.selectDefaultPaymentId(nextProps);      
    }
  }
  componentWillUnmount() {
    this.initializeTopupContent();
  }
  onQRImgLoad() {
    this.setState({ QRImageLoading: false });
  }
  onTopupRequestSubmit() {
    this.dispatch({ type: 'transferModel/postTopups' });
  }
  onInputChange(event) {
    const eventTarget = event.target;
    const { value, max, name } = eventTarget;
    const payload = { [name]: { value } };
    if (`${value}`.length <= max) {
      this.dispatch({
        type: 'formModel/updateState', payload
      });
      this.dispatch({ type: 'formModel/initializeState', payload: ['responseMsg'] });
    }
    this.setState({ formIsPristine: false });
  }
  onAmountSelect(amount) {
    this.dispatch({
      type: 'formModel/updateState',
      payload: {
        topupAmount: { value: amount },
      }
    });
  }
  onCheckRecordClick() {
    this.dispatch({
      type: 'layoutModel/updateState',
      payload: { profileSelectedNav: 'topupRecord', profileExpandedNav: 'record' }
    });
  }
  onBankTransferConfirm() {
    this.dispatch({ type: 'transferModel/putBankTransferConfirmation' });
  }
  onTopupTypeSelect(transferToupType) {
    const { dispatch } = this.props;
    dispatch({
      type: 'formModel/updateState',
      payload: {
        transferToupType: { value: transferToupType },
      }
    });
  }
  initializeTopupContent() {
    this.dispatch({
      type: 'transferModel/initializeState',
      payload: [
        'adminBankId', 'merchantName', 'paymentId', 'paymentType', 'topupType',
        'dataImg', 'data', 'webview', 'paymentMethod', 'transactionId', 'amount',
        'paymentPlatformCode', 'transferNo'
      ]
    });
    this.dispatch({
      type: 'formModel/initializeState',
      payload: [
        'bankName', 'bankCardNo', 'receiptName', 'bankAddress', 'remarks', 'responseMsg',
        'topupAmount', 'transferToupType', 'topupCardRealname', 'topupTime',
      ]
    });
  }
  validateInput(payload) {
    const { dispatch } = this.props;
    dispatch({
      type: 'formModel/validateInput', payload
    });
  }
  selectDefaultPaymentId({ paymentList, topupType }) {
    const defaultPayment = _.find(paymentList, { type: topupType });
    if (defaultPayment) {
      const { type, merchantName, paymentId, paymentType } = defaultPayment;
      this.dispatch({
        type: 'transferModel/updateState',
        payload: {
          merchantName,
          paymentId,
          paymentType,
          topupType: type,
        }
      });
    }
  }
  renderQRCode() {
    const { data, merchantName, amount, awaitingResponse } = this.props;
    return (
      <div className={css.profile_contentBody}>
        <h4 className={css.profile_formLabel}>
          { merchantName }
          <LoadingBar isLoading={awaitingResponse} />
        </h4>
        <p className={css.profile_paymentAmount}>支付金额<br /><strong>¥{ amount }</strong></p>
        <p className={css.profile_reminder}>
          <i>请在{TYPE.paymentTypeRefs[this.props.topupType]}中打开“扫一扫”扫描下面的二维码,</i>
          <MDIcon iconName="qrcode-scan" /><br />
          <i>扫描完毕后，请按"扫描完毕"。</i>
        </p>
        <div className={css.profile_paymentQRCode}>
          <QRCode value={data} size={250} />
        </div>
      </div>
    );
  }
  renderImage() {
    const { dataImg, merchantName, awaitingResponse } = this.props;
    const { QRImageLoading } = this.state;
    const imgClassName = QRImageLoading ? css.profile_paymentImg__hidden : css.profile_paymentImg;
    return (
      <div className={css.profile_contentBody}>
        <h4 className={css.profile_formLabel}>
          { merchantName }
          <LoadingBar isLoading={awaitingResponse} />          
        </h4>
        {
          QRImageLoading ? 
          <p className={css.profile_reminder}>
            正努力加载当中<EllipsisLoader duration={3000} />
          </p> :
          <p className={css.profile_reminder}>
            <i>请在{TYPE.paymentTypeRefs[this.props.topupType]}中打开“扫一扫”扫描下面的二维码,</i>
            <MDIcon iconName="qrcode-scan" /><br />
            <i>扫描完毕后，请按"扫描完毕"。</i>
          </p>
        }
        <div className={css.profile_paymentQRCode}>
          <img
            onLoad={this.onQRImgLoad.bind(this)}
            className={imgClassName}
            src={dataImg} alt={merchantName}
          />
        </div>
      </div>
    );
  }
  renderResponseMsg() {
    const { responseMsg } = this.props;
    const { msg, color, icon } = responseMsg;
    if (msg) {
      return (
        <div
          style={{ backgroundColor: color }}
          className={css.profile_formResponse}
        >
          <MDIcon iconName={icon} />
          <span>{ msg }</span>
        </div>
      );
    } return null;
  }
  renderAmountDropDown() {
    return _.map([50, 100, 300, 500, 1000, 2000, 3000, 5000], (amount) => {
      return (
        <button
          key={amount} className={css.register_option}
          onClick={this.onAmountSelect.bind(this, amount)}
        >
          <span className={css.register_optionSpan__Name}>{addCommas(amount)}元</span>
        </button>
      );
    });
  }
  renderTransferDropDown() {
    return _.map(TYPE.bankTransferTypeRefs, (value, key) => {
      return (
        <button
          key={key} className={css.register_option}
          onClick={this.onTopupTypeSelect.bind(this, key)}
        >
          <span className={css.register_optionSpan__Name}>{ value }</span>
        </button>
      );
    });
  }
  renderBtnRow() {
    const {
      topupAmount, awaitingResponse, paymentId, transferToupType, topupCardRealname,
      transferNo, data, dataImg
    } = this.props;
    if (transferNo || data || dataImg) {
      return (
        <div className={css.profile_formBtnRow}>
          <OrangeButton
            disabled={awaitingResponse}
            className={css.profile_formSubmitBtn}
            onClick={this.onCheckRecordClick.bind(this)}
            placeholder={'查看充值记录'}
          />
        </div>
      );
    } else if (paymentId) {
      return (
        <div className={css.profile_formBtnRow}>
          <OrangeButton
            loading={awaitingResponse}
            disabled={!topupAmount.value || awaitingResponse}
            className={css.profile_formSubmitBtn}
            onClick={this.onTopupRequestSubmit.bind(this)}
            placeholder={awaitingResponse ? '请稍等' : '继续下一步'}
          />
        </div>
      );
    } else {
      const disabled = awaitingResponse ||
        !topupAmount.value || !transferToupType.value || !topupCardRealname.value;
      return (
        <div className={css.profile_formBtnRow}>
          <OrangeButton
            loading={awaitingResponse}
            disabled={disabled}
            className={css.profile_formSubmitBtn}
            onClick={this.onBankTransferConfirm.bind(this)}
            placeholder={awaitingResponse ? '请稍等' : '确认充值'}
          />
        </div>
      );
    }
  }
  renderBankNameInput() {
    const { bankName } = this.props;
    const { value } = bankName;
    return (
      <Input
        readOnly
        label={`${TYPE.inputFieldRefs.bankName}`}
        mouseLeaveSensitive
        value={value || '-'}
      />
    );
  }
  renderBankAddressInput() {
    const { bankAddress } = this.props;
    const { value } = bankAddress;
    return (
      <Input
        readOnly
        label={`${TYPE.inputFieldRefs.bankAddress}`}
        mouseLeaveSensitive
        value={value || '-'}
      />
    );
  }
  renderBankCardNo() {
    const { bankCardNo } = this.props;
    const { value } = bankCardNo;
    return (
      <Input
        readOnly
        label={`${TYPE.inputFieldRefs.bankCardNo}`}
        mouseLeaveSensitive
        value={value || '-'}
      />
    );
  }
  renderReceiptName() {
    const { receiptName } = this.props;
    const { value } = receiptName;
    return (
      <Input
        readOnly
        label={`${TYPE.inputFieldRefs.receiptName}`}
        mouseLeaveSensitive
        value={value || '-'}
      />
    );
  }
  renderTopupAmountInput() {
    const { topupAmount, awaitingResponse } = this.props;
    const { value, icon, color, inputMsg } = topupAmount;
    return (
      <Input
        readOnly={awaitingResponse}
        dataColor={color}
        dataIcon={icon}
        dataMsg={inputMsg}
        label={`${TYPE.inputFieldRefs.topupAmount}`}
        min="0" max="5000"
        name="topupAmount"
        pattern="\d[0-9]\d"
        placeholder="请选择支付金额"
        renderOptions={this.renderAmountDropDown.bind(this)}
        type="number"
        mouseLeaveSensitive
        value={value}
      />
    );
  }
  renderTopupMethodInput() {
    const { transferToupType, awaitingResponse } = this.props;
    const { value, icon, color, inputMsg } = transferToupType;
    const methodDisplayText = TYPE.bankTransferTypeRefs[value];
    return (
      <Input
        readOnly={awaitingResponse}
        dataColor={color}
        dataIcon={icon}
        dataMsg={inputMsg}
        label={`${TYPE.inputFieldRefs.transferToupType}`}
        min="2" max="10"
        name="transferToupType"
        pattern="[^\u0000-\u00FF]{2,10}$"
        placeholder="请选择存款方式"
        renderOptions={this.renderTransferDropDown.bind(this)}
        mouseLeaveSensitive
        value={methodDisplayText}
      />
    );
  }
  renderTopupCardRealnameInput() {
    const { topupCardRealname } = this.props;
    const { value, icon, color, inputMsg } = topupCardRealname;
    return (
      <Input
        dataColor={color}
        dataIcon={icon}
        dataMsg={inputMsg}
        label={`${TYPE.inputFieldRefs.topupCardRealname}`}
        min="2" max="10"
        name="topupCardRealname"
        onBlur={this.validateInput.bind(this)}
        onChange={this.onInputChange.bind(this)}
        pattern="[^\u0000-\u00FF]{2,10}$"
        placeholder="请输入 2-10 位中文字符"
        value={value}
      />
    );
  }
  renderTopupTimeInput() {
    const { topupTime } = this.props;
    const { value, icon, color, inputMsg } = topupTime;
    return (
      <Input
        dataColor={color}
        dataIcon={icon}
        dataMsg={inputMsg}
        label={`${TYPE.inputFieldRefs.topupTime}`}
        name="topupTime"
        onChange={this.onInputChange.bind(this)}
        placeholder="请输入存款时间"
        type="time"
        value={value}
      />
    );
  }
  renderTopupDateInput() {
    const { topupDate } = this.props;
    const { value, icon, color, inputMsg } = topupDate;
    return (
      <Input
        dataColor={color}
        dataIcon={icon}
        dataMsg={inputMsg}
        label={`${TYPE.inputFieldRefs.topupDate}`}
        name="topupDate"
        onChange={this.onInputChange.bind(this)}
        placeholder="请输入存款时间"
        type="date"
        value={value}
      />
    );
  }
  renderBankTransferForm() {
    const { awaitingResponse } = this.props;
    return (
      <div className={css.profile_contentBody}>
        <h4 className={css.profile_formLabel}>
          收款人资料
          <LoadingBar />
        </h4>
        { this.renderBankNameInput() }
        { this.renderBankAddressInput() }
        { this.renderBankCardNo() }
        { this.renderReceiptName() }
        <h4 className={css.profile_formLabel}>
          存款资料
          <LoadingBar isLoading={awaitingResponse} />
        </h4>
        { this.renderTopupAmountInput() } 
        { this.renderTopupMethodInput() }
        { this.renderTopupCardRealnameInput() }
        <div className={css.profile_inputInlineRow}>
          <div className={css.profile_inputInline__dateTime}>
            { this.renderTopupDateInput() }
          </div>
          <div className={css.profile_inputInline__dateTime}>
            { this.renderTopupTimeInput() }
          </div>
        </div>
      </div>
    );
  }
  renderScene() {
    const {
      merchantName, webview, paymentMethod, data, dataImg, adminBankId,
      awaitingResponse
    } = this.props;
    if (!webview && paymentMethod !== 'BANK_ONLINE' && data) {
      return this.renderQRCode();
    } else if (dataImg) {
      return this.renderImage();
    } else if (merchantName) {
      return (
        <div className={css.profile_contentBody}>
          <h4 className={css.profile_formLabel}>
            { merchantName }
            <LoadingBar isLoading={awaitingResponse} />
          </h4>
          { this.renderTopupAmountInput() }
        </div>
      );
    } else if (adminBankId) {
      return this.renderBankTransferForm();
    }
    return (
      <div className={css.profile_contentBody}>
        <h4 className={css.profile_formLabel}>
          充值
          <LoadingBar isLoading={awaitingResponse} />
        </h4>
        <p className={css.profile_reminder}>
          <MDIcon iconName="lightbulb-on-outline" />
          <i>尊敬的用户，请继续选择支付方式</i>
        </p>
      </div>
    );
  }
  render() {
    return (
      <div>
        { this.renderScene() }
        { this.renderResponseMsg() }
        { this.renderBtnRow() }
      </div>
    );
  }
}

const mapStatesToProps = ({ transferModel, formModel }) => {
  return { ...transferModel, ...formModel };
};

export default connect(mapStatesToProps)(TopUp);
