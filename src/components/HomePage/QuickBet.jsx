import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import _ from 'lodash';
import { MDIcon, LoadingBar, OrangeButton, EllipsisLoader } from '../General';
import { settingMap, numberGenerators } from '../../utils';
import css from '../../styles/homepage/quickBet.less';

const { gamesMap } = settingMap;

const ballSetting = {
  SSC: {
		ballArray: numberGenerators.create({ length: 9 }).get(),
		group: false,
		openLength: 5
	},
  BJPK10: {
		ballArray: numberGenerators.create({ length: 10, start: 1 }).get(),
		group: true,
		openLength: 10
	},
  SSL: {
		ballArray: numberGenerators.create({ length: 9 }).get(),
		group: false,
		openLength: 5
	},
  KL10F: {
		ballArray: numberGenerators.create({ length: 20 }).get(),
		group: true,
		openLength: 5
	},
  D11X5: {
		ballArray: numberGenerators.create({ length: 11, start: 1 }).getLeading(),
		group: true,
		openLength: 5},
  D3: {
		ballArray: numberGenerators.create({ length: 9 }).get(),
		group: false,
		openLength: 3
	},
  MarkSix: { 
		ballArray: numberGenerators.create({ length: 49, start: 1 }).getLeading(),
		group: true,
		openLength: 7
	},
  HF28: {
		ballArray: numberGenerators.create({ length: 9 }).get(),
		group: false,
		openLength: 3
	},
  PL: {
		ballArray: numberGenerators.create({ length: 9 }).get(),
		group: false,
		openLength: 3 },
  K3: {
		ballArray: numberGenerators.create({ length: 6, start: 1 }).get(),
		group: false,
		openLength: 3
	}
};

class CenterPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
			highFreqLotIsPristine: true,
			lowFreqLotIsPristine: true,
      highFreqLotId: ['HF_CQSSC', 'HF_BJPK10', 'HF_SHD11'],
      lowFreqLotId: ['MARK_SIX', 'X3D'],
			highFreqSelectedId: 'HF_CQSSC',
			lowFreqSelectedId: 'MARK_SIX',
			highRandomBalls: [],
			lowRandomBalls: []
    };
		this.setOpenCode = this.setOpenCode.bind(this);
  }
	componentWillReceiveProps(nextProps) {
		this.setOpenCode('high', nextProps);
		this.setOpenCode('low', nextProps);
	}
	onRandomNumClick(freq) {
		const id = this.state[`${freq}FreqSelectedId`];
		const mapKey = _.find(gamesMap, ['gameUniqueId', id]).gameSettingsMap;
    const { ballArray, group, openLength } = ballSetting[mapKey];
    const randomBalls = this.getRandomBalls(ballArray, openLength, group);
		this.setState({
			[`${freq}RandomBalls`]: randomBalls,
			[`${freq}FreqLotIsPristine`]: false,
		});
	}
	onSelectGame({ freq, id }) {
		const { allHistory } = this.props;
		const lotteryHistory = _.find(allHistory, ['gameUniqueId', id]);
		if (lotteryHistory.openStatus) {
			const randomBalls = _.split(lotteryHistory.openCode, ',');
			this.setState({
				[`${freq}FreqSelectedId`]: id,
				[`${freq}RandomBalls`]: randomBalls,
				[`${freq}FreqLotIsPristine`]: true,
			});
		} else {
			this.setState({
				[`${freq}FreqSelectedId`]: id,
				[`${freq}RandomBalls`]: [],
				[`${freq}FreqLotIsPristine`]: true,
			});
		}
	}
	setOpenCode(freq, { allHistory }) {
		if (allHistory) {
			const id = this.state[`${freq}FreqLotId`][0];
			const lotteryHistory = _.find(allHistory, ['gameUniqueId', id]);
			if (lotteryHistory.openStatus) {
				const randomBalls = _.split(lotteryHistory.openCode, ',');
				this.setState({
					[`${freq}RandomBalls`]: randomBalls
				});
			}
		}
	}
	getRandomIndex(length) {
		return Math.floor(Math.random() * length);
	}
	getRandomBalls(balls, openCodeLength, group) {
		const ballArr = [];
		const ballArr2 = balls.slice();
		for (let i = 0; i < openCodeLength; i++) {
			const randomIndex = this.getRandomIndex(ballArr2.length);
			ballArr[i] = ballArr2[randomIndex];
			if (group) ballArr2.splice(randomIndex, 1);
		}
		return ballArr;
	}
	getBallArray(max, min, digit) {
		const arr = [];
		const minimum = min || 0;
		for (let i = minimum; i <= max; i++) {
			i = digit && i < 10 ? `0${i}` : i;
			i += '';
			arr.push(i);
		}
		return arr;
	}
	bubbling(randomBalls) {
		const array = [...randomBalls];
		const length = array.length;
		for (let i = length - 1; i >= 0; i--) {
			for (let j = 0; j < i; j++) {
				const num = array[j];
				if (parseInt(array[j]) > parseInt(array[j + 1])) {
					array[j] = array[j + 1];
					array[j + 1] = num;
				}
			}
		}
		return array;
	}
	renderLotBalls(freq) {
    const randomBalls = this.state[`${freq}RandomBalls`];
		const lotIsPristine = this.state[`${freq}FreqLotIsPristine`];
		const btnClass = lotIsPristine ? css.quickBet_refreshBtn__isPristine : css.quickBet_refreshBtn;
		const lotBallClass = lotIsPristine ?
			css.quickBet_contentsNumber__history : css.quickBet_contentsNumber;
    return (
			<div className={css.quickBet_numberingRow}>
				<div className={css.quickBet_lotNumbers}>
					{	randomBalls.length ?
						randomBalls.map((number, index) => {
							return (
								<span
									className={lotBallClass} key={`${number}${index}`}
								>{ number }
								</span>
							);
						}) :
						<p className={css.quickBet_awaitingMsg}>
							正等待开奖<EllipsisLoader duration={500} />
						</p>
					}
				</div>
				<button
					onClick={this.onRandomNumClick.bind(this, freq)}
					className={btnClass}
				>
					<MDIcon iconName={lotIsPristine ? 'plus-one' : 'autorenew'} />
					{lotIsPristine ? '再来' : '换'}一注
				</button>
			</div>
    );
  }
  renderTabs(freq) {
		const lotIds = this.state[`${freq}FreqLotId`];
		const { gameInfos } = this.props;
    const list = _.map(lotIds, (gameId) => {
      return _.find(gameInfos, ['gameUniqueId', gameId]);
    });
    if (list.length) {
      return _.map(list, (listItem) => {
        const {
          gameUniqueId, gameNameInChinese
        } = listItem;
				const btnIsActive = gameUniqueId === this.state[`${freq}FreqSelectedId`];
				const className = btnIsActive ?
					css.quickBet_tab__active : css.quickBet_tab;
        return (
          <button
						disabled={btnIsActive}
						key={gameUniqueId}
						className={className}
						onClick={this.onSelectGame.bind(this, { freq, id: gameUniqueId })}
          >
						{ gameNameInChinese }
					</button>
        );
      });
    } return null;
  }
	renderCal(freq) {
		return (
			<div className={css.quickBet_calRow}>
				<div className={css.quickBet_calulator}>
					<div className={css.quickBet_amount}>
						<input
							className={css.quickBet_amountInput} type="number"
							defaultValue={2}
						/>
						元
					</div>
					<div className={css.quickBet_multiplier}>
						<button className={css.quickBet_multiplyBtn}>
							<MDIcon iconName="minus-circle" />
						</button>
						<strong className={css.quickBet_multiplySpan}>1 倍</strong>
						<button className={css.quickBet_multiplyBtn}>
							<MDIcon iconName="plus-circle" />
						</button>
					</div>
				</div>
				<OrangeButton placeholder="立刻下注" />
			</div>
		);
	}
	renderBody(freq) {
		const selectedGameId = this.state[`${freq}FreqSelectedId`];
		const lotIsPristine = this.state[`${freq}FreqLotIsPristine`];		
		const { gameInfos, allHistory } = this.props;
		const gameInfo = _.find(gameInfos, ['gameUniqueId', selectedGameId]);
		const gameHistory = _.find(allHistory, ['gameUniqueId', selectedGameId]);
		if (gameInfo) {
			const { gameDescription, gameIconUrl, gameNameInChinese } = gameInfo;
			const { planNo, stopOrderTime } = gameHistory;
      return (
				<div className={css.quickBet_body}>
					<div className={css.quickBet_gameInfos}>
						<img src={gameIconUrl} alt={gameNameInChinese} className={css.quickBet_gameIcon} />
						<div className={css.quickBet_infoContent}>
							<p className={css.quickBet_gameIssueNo}>第{planNo}期</p>
							<p className={css.quickBet_gameName}>{ gameNameInChinese }</p>
							<p className={css.quickBet_gameDescription} >{gameDescription}</p>
						</div>
						<div className={css.quickBet_actionBtns}>
							<button className={css.quickBet_actionBtn}>
								<MDIcon iconName="cursor-pointer" />
								<i>手动选号</i>
							</button>
							<button className={css.quickBet_actionBtn}>
								<MDIcon iconName="table-large" />
								<i>走势图</i>
							</button>
						</div>
					</div>
					<p
						className={css.quickBet_openCodeLabel}
					>
						{ lotIsPristine ? '上期开奖' : '投注'}号码
					</p>
					{ this.renderLotBalls(freq)}
					{ this.renderCal(freq) }
				</div>
      );
    } return null;
	}
  renderScene() {
		return (
			<div>
				<div className={css.quickBet_section}>
					<div className={css.quickBet_tabs}>
						{ this.renderTabs('high') }
					</div>
					<LoadingBar style={{ margin: 0 }} />
					{ this.renderBody('high') }
				</div>
				<div className={css.quickBet_section}>
					<div className={css.quickBet_tabs}>
						{ this.renderTabs('low') }
					</div>
					<LoadingBar style={{ margin: 0 }} />			
					{ this.renderBody('low') }
				</div>
			</div>
		);
  }
  render() {
    const { gameInfos, allHistory } = this.props;
    if (gameInfos.length && allHistory.length) {
      return this.renderScene();
    } return null;
  }
}

const mapStatesToProps = ({ homeInfoModel, gameInfosModel }) => {
  const {
    highFreqSelectedTab,
    lowFreqSelectedTab,
    highFreqSelectedContent,
    lowFreqSelectedContent,
  } = homeInfoModel;
  const { allHistory, gameInfosHot, gameInfosRecommend } = gameInfosModel;
  const gameInfos = [...gameInfosHot, ...gameInfosRecommend];
  return {
    allHistory,
    gameInfos,
    highFreqSelectedTab,
    lowFreqSelectedTab,
    highFreqSelectedContent,
    lowFreqSelectedContent,
  };
};

export default connect(mapStatesToProps)(CenterPanel);
