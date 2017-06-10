import React, { Component } from 'react';
import css from '../../styles/playground/playgroundIndex.less';

class CountdownNumber extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentCount: props.duration
    };
    this.setCounter = this.setCounter.bind(this);
    this.setTimer = this.setTimer.bind(this);
    this.clearTimer = this.clearTimer.bind(this);
    this.updateCountDownSpan = this.updateCountDownSpan.bind(this);
  }
  componentWillMount() {
    this.setTimer();
    this.setCounter(this.props);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps) {
      this.clearTimer();
      this.setCounter(nextProps);      
      this.setTimer();
    }
  }
  componentWillUnmount() {
    this.clearTimer();
  }
  setCounter({ duration }) {
    const hour = Math.floor(duration / 3600);
    const min = Math.floor((duration - (hour * 3600)) / 60);
    const sec = duration - (min * 60) - (hour * 3600);
    this.setState({
      currentCount: duration, hour, min, sec
    });
  }
  setTimer() {
    const countDownTimer = setInterval(this.updateCountDownSpan, 1000);
    this.setState({ countDownTimer });
  }
  updateCountDownSpan() {
    const { currentCount } = this.state;
    const hour = Math.floor(currentCount / 3600);
    const min = Math.floor((currentCount - (hour * 3600)) / 60);
    const sec = currentCount - (min * 60) - (hour * 3600);
    if (currentCount > 0) {
      this.setState({
        currentCount: this.state.currentCount - 1, hour, min, sec
      });
    } else if (currentCount === 0) {
      this.clearTimer();
      // console.debug(this.props);
      this.props.onFinised();
    }
  }
  clearTimer() {
    clearInterval(this.state.countDownTimer);
  }

  render() {
    const { hour, min, sec } = this.state;
    // You do not need to decrease the value here
    return (
      <span>
        { hour > 0 && <span><code className={css.playground_countDownSpan}>{hour}</code>小时</span>}
        { min > 0 && <span><code className={css.playground_countDownSpan}>{min}</code>分</span>}
        { sec > 0 && <span><code className={css.playground_countDownSpan}>{sec}</code>秒</span>}
      </span>
    );
  }
}

export default CountdownNumber;
