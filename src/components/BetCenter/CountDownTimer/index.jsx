import React from 'react';

import CircularProgressBar from './CircularProgressbar';
import styles from './style.less';
// Generic Countdown Timer UI component
//
// https://github.com/uken/react-countdown-timer
//
// props:
//   - initialTimeRemaining: Number
//       The time remaining for the countdown (in ms).
//
//   - interval: Number (optional -- default: 1000ms)
//       The time between timer ticks (in ms).
//
//   - formatFunc(timeRemaining): Function (optional)
//       A function that formats the timeRemaining.
//
//   - tickCallback(timeRemaining): Function (optional)
//       A function to call each tick.
//
//   - completeCallback(): Function (optional)
//       A function to call when the countdown completes.
//
const CountDownTimer = React.createClass({
  displayName: 'CountDownTimer',

  propTypes: {
    initialTimeRemaining: React.PropTypes.number.isRequired,
    interval: React.PropTypes.number,
    formatFunc: React.PropTypes.func,
    tickCallback: React.PropTypes.func,
    completeCallback: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      interval: 1000,
      formatFunc: null,
      tickCallback: null,
      completeCallback: null
    };
  },

  getInitialState() {
    // Normally an anti-pattern to use this.props in getInitialState,
    // but these are all initializations (not an anti-pattern).
    return {
      timeRemaining: this.props.initialTimeRemaining,
      timeoutId: null,
      prevTime: null
    };
  },

  componentDidMount() {
    this.tick();
  },

  componentWillReceiveProps(newProps) {
    if (this.state.timeoutId) { clearTimeout(this.state.timeoutId); }
    this.setState({ prevTime: null, timeRemaining: newProps.initialTimeRemaining });
  },

  componentDidUpdate() {
    if ((!this.state.prevTime) && this.state.timeRemaining > 0 && this.isMounted()) {
      this.tick();
    }
  },

  componentWillUnmount() {
    clearTimeout(this.state.timeoutId);
  },

  tick() {
    const currentTime = Date.now();
    const dt = this.state.prevTime ? (currentTime - this.state.prevTime) : 0;
    const interval = this.props.interval;

    // correct for small variations in actual timeout time
    const timeRemainingInInterval = (interval - (dt % interval));
    let timeout = timeRemainingInInterval;

    if (timeRemainingInInterval < (interval / 2.0)) {
      timeout += interval;
    }

    const timeRemaining = Math.max(this.state.timeRemaining - dt, 0);
    const countdownComplete = (this.state.prevTime && timeRemaining <= 0);

    if (this.isMounted()) {
      if (this.state.timeoutId) { clearTimeout(this.state.timeoutId); }
      this.setState({
        timeoutId: countdownComplete ? null : setTimeout(this.tick, timeout),
        prevTime: currentTime,
        timeRemaining
      });
    }

    if (countdownComplete) {
      if (this.props.completeCallback) { this.props.completeCallback(); }
      return;
    }

    if (this.props.tickCallback) {
      this.props.tickCallback(timeRemaining);
    }
  },

  getFormattedTime(milliseconds) {
    if (this.props.formatFunc) {
      return this.props.formatFunc(milliseconds);
    }

    const totalSeconds = Math.round(milliseconds / 1000);

    let seconds = parseInt(totalSeconds % 60, 10);
    let minutes = parseInt(totalSeconds / 60, 10) % 60;
    let hours = parseInt(totalSeconds / 3600, 10);

    seconds = seconds < 10 ? `0${seconds}` : seconds;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    hours = hours < 10 ? `0${hours}` : hours;

    return { hours, minutes, seconds };
  },

  render() {
    const timeRemaining = this.state.timeRemaining;
    const currentTimePiece = this.getFormattedTime(timeRemaining);
    const totalSeconds = Math.round(timeRemaining / 1000);
    const hours = parseInt(totalSeconds / 3600, 10);
    const minutes = parseInt(totalSeconds / 60, 10) % 60;
    const seconds = parseInt(totalSeconds % 60, 10);
    return (
      <div className={styles.countDownContainer}>
        <span className={styles.circle}>
          <CircularProgressBar percentage={hours / 24 * 100} textForPercentage={() => (`${currentTimePiece.hours}`)} />
        </span>
        <span className={styles.comma}>:</span>
        <span className={styles.circle}>
          <CircularProgressBar percentage={minutes / 60 * 100} textForPercentage={() => (`${currentTimePiece.minutes}`)} />
        </span>
        <span className={styles.comma}>:</span>
        <span className={styles.circle}>
          <CircularProgressBar percentage={seconds / 60 * 100} textForPercentage={() => (`${currentTimePiece.seconds}`)} strokeWidth={10} />
        </span>
      </div>
    );
  }
});

export default CountDownTimer;
