import React, { Component } from 'react';
import { MDIcon } from '../General';
import hotIcon from '../../assets/image/icon-hot.png';
import css from './styles.less';

// const MenuItemGroup = Menu.ItemGroup;
// const IconSample = 'http://192.168.1.25:8383/106_static_assets/mobile/gameIcon/cq_ssc%403x.1.0.png';


const LOTTERY_CATEGORY = [
  {
    type: 'HOT',
    typeNameInChinese: '热门彩票',
    typeIcon: hotIcon,
    uniqueGameIds: [
      'HF_CQSSC', 'HF_BJPK10', 'HF_LFSSC', 'HF_LFPK10', 'MARK_SIX', 'HF_LFKLPK', 'HF_LF28'
    ],
  },
  {
    type: 'SSC',
    typeNameInChinese: '时时彩',
    typeIcon: hotIcon,
    uniqueGameIds: ['HF_CQSSC', 'HF_TJSSC', 'HF_XJSSC', 'HF_LFSSC'],
  },
  {
    type: 'PK10',
    typeNameInChinese: 'PK拾赛车',
    typeIcon: hotIcon,
    uniqueGameIds: ['HF_BJPK10', 'HF_LFPK10'],
  },
  {
    type: 'PCDD',
    typeNameInChinese: 'PC蛋蛋',
    typeIcon: hotIcon,
    uniqueGameIds: ['HF_BJ28', 'HF_LF28'],
  },
  {
    type: 'D11',
    typeNameInChinese: '十一选五',
    typeIcon: hotIcon,
    uniqueGameIds: ['HF_AHD11', 'HF_GDD11', 'HF_JXD11', 'HF_SDD11'],
  },
  {
    type: 'K3',
    typeNameInChinese: '快三',
    typeIcon: hotIcon,
    uniqueGameIds: ['HF_AHK3', 'HF_GXK3'],
  },
  {
    type: 'KL10F',
    typeNameInChinese: '快乐十分',
    typeIcon: hotIcon,
    uniqueGameIds: ['HF_CQKL10F', 'HF_GDKL10F'],
  },
  {
    type: 'LF',
    typeNameInChinese: '低频彩',
    typeIcon: hotIcon,
    uniqueGameIds: ['MARK_SIX', 'X3D', 'PL3', 'PL5'],
  },
  {
    type: 'OTHERS',
    typeNameInChinese: '其他彩票',
    typeIcon: hotIcon,
    uniqueGameIds: ['HF_SHSSL'],
  },
  {
    type: 'EGAMES',
    typeNameInChinese: '电子游戏',
    typeIcon: hotIcon,
    uniqueGameIds: [],
  },
  {
    type: 'SPORTS',
    typeNameInChinese: '体彩竞技',
    typeIcon: hotIcon,
    uniqueGameIds: [],
  }
];

class SideNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true,
      expandedMenus: 'HOT',
    };
    this.dispatch = this.props.dispatch.bind(this);
    this.initializeGameboard = this.initializeGameboard.bind(this);
  }
  componentWillUnmount() {
    this.initializeGameboard();
  }
  onGameSelect(thisGameId) {
    this.initializeGameboard();
    this.dispatch({
      type: 'betCenter/updateState', payload: { thisGameId }
    });
  }
  getSelectedGame(game) {
    const { gameInfosHot, gameInfosRecommend } = this.props;
    const allGameInfos = [...gameInfosHot, ...gameInfosRecommend];
    let selectedGame = '';
    allGameInfos.forEach(item => {
      if (item.gameUniqueId === game) {
        selectedGame = item;
      }
    });
    return selectedGame;
  }
  initializeGameboard() {
    this.dispatch({
      type: 'betCenter/initializeState',
      payload: [
        'methodGroup', 'gameMethod', 'methodId', 'gameNav', 'gameSubNav', 
        'betEntries', 'allBetObj', 'allOpenOptions', 'responseMessage', 'responseColor'
      ]
    });
  }
  toggleMenu() {
    this.setState({
      expanded: !this.state.expanded,
    });
  }
  expandToggle(expandedMenus) {
    this.setState({ expandedMenus });
  }
  renderSubMenuItems(type, { uniqueGameIds }) {
    const { thisGameId } = this.props;    
    if (uniqueGameIds.length) {
      return uniqueGameIds.map((game) => {
        const selectedGame = this.getSelectedGame(game);
        const {
          gameUniqueId, status, gameIconUrl, gameNameInChinese, gameIconGrayUrl
        } = selectedGame;
        const btnActive = gameUniqueId === thisGameId;
        return (
          <button
            onClick={this.onGameSelect.bind(this, gameUniqueId)}
            key={`${type}__${gameUniqueId}`} disabled={btnActive}
            className={css.subMenuItem} data-active={btnActive}
          >
            <img
              alt="gameIcon" className={css.gameIcon}
              src={status === 'NORMAL' ? gameIconUrl : gameIconGrayUrl}
            />
            <span className={css.gameName}>
              {gameNameInChinese}
            </span>
          </button>
        );
      });
    }
    return null;
  }
  render() {
    const { expandedMenus } = this.state;
    return (
      <div className={css.sideNav}>
        {
          LOTTERY_CATEGORY.map((category) => {
            const { type, typeNameInChinese, typeIcon } = category;
            const itemExpanded = expandedMenus === type;
            return (
              <div key={type} className={css.menuItem}>
                <button
                  onClick={this.expandToggle.bind(this, type)}
                  className={css.menuExpandToggle}
                >
                  <img src={typeIcon} className={css.typeIcon} alt="type icon" />
                  <span className={css.gameName}>{typeNameInChinese}</span>
                  <MDIcon
                    iconName="chevron-down"
                    className={itemExpanded ? css.menuChevron__rotate : css.menuChevron}
                  />
                </button>
                <div
                  className={
                    itemExpanded ?
                    css.subMenus__expanded : css.subMenus
                  }
                >
                  {this.renderSubMenuItems(type, category)}
                </div>
              </div>
            );
          })
        }
        <div
          className={css.fixIcon} onClick={this.toggleMenu.bind(this)}
        />
      </div>
    );
  }
}

export default SideNav;
