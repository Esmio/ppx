import React, { Component } from 'react';
import css from '../../styles/homepage/QRpanel.less';
import { Row, Column, Button, MDIcon } from '../General';
import mobileDevice from '../../assets/image/mobile_device.png';
import iphoneQR from '../../assets/image/iphone_QR.png';
import androidQR from '../../assets/image/android_QR.png';

export default class QRPanel extends Component {
  constructor() {
    super();
    this.state = {
      showIphoneQR: true
    };
  }
''
  toggleQR() {
    const { showIphoneQR } = this.state;
    this.setState({ showIphoneQR: !showIphoneQR });
  }
  renderCornerBox(x = 'top', y = 'left') {
    const cornerBoxStyles = { [x]: '-2px', [y]: '-2px' };
    return <div className={css.QR_codeBorder} style={cornerBoxStyles} />;
  }
  renderIcon(iconName) {
    return <MDIcon className={css.QRPanel_btnIcon} iconName={iconName} />;
  }
  renderQR() {
    const { showIphoneQR } = this.state;
    if (showIphoneQR) {
      return <img src={iphoneQR} alt="app screen example" className={css.QR_codeImg} />;
    }
    return <img src={androidQR} alt="app screen example" className={css.QR_codeImg} />;
  }
  render() {
    const { showIphoneQR } = this.state;
    return (
      <div className={css.QRPanel}>
        <h3 className={css.QRPanel_header}>手机购彩，轻轻松松变土豪！</h3>
        <Row className={css.QRPanel_body}>
          <Column width="50%" className={css.QR_code}>
            <h3>扫我下载</h3>
            <div className={css.QR_codeBody}>
              { this.renderCornerBox('top', 'left') }
              { this.renderCornerBox('top', 'right') }
              { this.renderCornerBox('bottom', 'left') }
              { this.renderCornerBox('bottom', 'right') }
              <div className={css.QR_codeBackdrop} />
              { this.renderQR() }
            </div>
          </Column>
          <Column width="50%" float="right" className={css.QRPanel_device}>
            <img src={mobileDevice} alt="app screen example" />
          </Column>
        </Row>
        <Row className={css.QRPanel_buttons}>
          <Button
            className={css[`QRPanel_button${showIphoneQR ? '__active' : ''}`]}
            icon={this.renderIcon('apple')}
            placeholder="Iphone版"
            onClick={this.toggleQR.bind(this)}
          />
          <Button
            className={css[`QRPanel_button${showIphoneQR ? '' : '__active'}`]}
            icon={this.renderIcon('android')}
            placeholder="Android版"
            onClick={this.toggleQR.bind(this)}
          />
        </Row>
      </div>
    );
  }
}
