import React, { Component } from 'react';
import { TimelineLite } from 'gsap';
import classnames from 'classnames';
import css from '../../styles/playground/playgroundIndex.less';
import lessVar from '../../styles/variables.less';

class CountdownRadial extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rotation: 180,
      timeout: 0
    };
    this.countdown = this.countdown.bind(this);
    this.startInterval = this.startInterval.bind(this);
    this.transitionColor = this.transitionColor.bind(this);
  }
  componentDidMount() {
    if (this.props.duration) {
      this.startInterval(this.props);
      this.transitionColor(this.props);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.duration !== this.props.duration) {
      this.setState({
        rotation: 180, timeout: 0
      });
      this.startInterval(nextProps);
      this.transitionColor(nextProps);
    }
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  setDOM(DOM, name) {
    if (DOM && this[name] !== DOM) {
      this[name] = DOM;
    }
  }
  startInterval({ duration }) {
    clearInterval(this.interval);
    const timeout = Math.round((duration * 1000) / 180);
    this.setState({ timeout });
    this.interval = setInterval(this.countdown, timeout);
  }
  countdown() {
    const { rotation } = this.state;
    this.setState({
      rotation: rotation - 1
    });
    if (rotation <= 1) {
      clearInterval(this.interval);
    }
  }
  transitionColor({ duration }) {
    this.tl = new TimelineLite();    
    const fillFullDOM = this.refs.fillFull;
    const fillHalfDOM = this.refs.fillHalf;
    const coverFillDOM = this.refs.coverFill;
    const targetDOMS = [
      fillFullDOM, fillHalfDOM, coverFillDOM
    ];
    this.tl.fromTo(
      targetDOMS,
      duration,
      { css: { backgroundColor: lessVar.lightOrange } },
      { css: { backgroundColor: lessVar.accentCinnabar } }
    );
  }
  render() {
    const { rotation, timeout } = this.state;
    const maskStyle = {
      transitionDuration: `${timeout}ms`,            
      transform: `rotate(${rotation}deg)`
    };
    const fullRotateStyle = {
      transitionDuration: `${timeout}ms`,         
      transform: `rotate(${rotation * 2}deg)`,
    };
    const halfRotateStyle = {
      transitionDuration: `${timeout}ms`,   
      transform: `rotate(${rotation}deg)`,
    };
    return (
      <div className={css.playground_countdown}>
        <div className={css.playground_countdownCircle}>
          <div
            style={maskStyle}
            className={css.playground_countdownMask}
          >
            <div
              ref="fillFull"
              style={halfRotateStyle}
              className={css.playground_countdownFill}
            />
          </div>
          <div className={css.playground_countdownMask}>
            <div
              ref="fillHalf"
              style={halfRotateStyle}
              className={css.playground_countdownFill}
            />
            <div
              ref="coverFill"          
              style={fullRotateStyle}
              className={classnames(
                css.playground_countdownFill,
                css.playground_countdownFill__fix
              )}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default CountdownRadial;
