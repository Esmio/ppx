/**
 * Created by sean.junior-jx on 2017/5/27.
 */
import React from 'react';
import { Table } from 'antd';
import moment from 'moment';
import styles from './AwardTable.less';
import markSixColor from './markSixColorMap';

const diceMap = [
  require('../../assets/gamepic/shaizi1.png'),
  require('../../assets/gamepic/shaizi2.png'),
  require('../../assets/gamepic/shaizi3.png'),
  require('../../assets/gamepic/shaizi4.png'),
  require('../../assets/gamepic/shaizi5.png'),
  require('../../assets/gamepic/shaizi6.png'),
];

const pokerMap = [
  require('../../assets/gamepic/pk_top_heitao.png'),
  require('../../assets/gamepic/pk_top_taoxin.png'),
  require('../../assets/gamepic/pk_top_meihua.png'),
  require('../../assets/gamepic/pk_top_fangkuai.png'),
];

function getDXDS(number, JZ) {
  let str = '';
  if (JZ) {
    if (number < 6) {
      return '极小';
    } else if (number > 21) {
      return '极大';
    }
  }

  if (JZ) {
    if (number > 13) {
      str += '大';
    } else {
      str += '小';
    }
  } else if (number > 4) {
      str += '大';
    } else {
      str += '小';
    }

  if ((parseInt(number, 10) + 2) % 2 === 0) {
    str += '双';
  } else {
    str += '单';
  }
  return str;
}


function ssc(number, desc) {
  const tempArr = number.split(',');
  const lastNumber = tempArr[tempArr.length - 1];
  const lastSecNumber = tempArr[tempArr.length - 2];
  return (
    <div>
      {
        tempArr.map((item, index) => {
          return <span key={index} className={styles.ssc}> {item} </span>;
        })
      }
      {
        desc && <span> {getDXDS(lastSecNumber)} | {getDXDS(lastNumber)} </span>
      }
    </div>
  );
}


function k3(number) {
  const tempArr = number.split(',');
  return (
    <div className={styles.k3}>
      {
        tempArr.map((item, index) => {
          return (<span
            key={index}
            className={styles.saizi}
          >
            <img src={diceMap[item - 1]} alt={item} />
          </span>);
        })
      }
      <span> 和值 = {tempArr.reduce((prev, next) => +prev + +next)} </span>
    </div>
  );
}

function markSix(number) {
  if (!number) {
    return false;
  }
  const tempArr = number.split(',');
  const lastNumber = tempArr[tempArr.length - 1].toString();
  return (
    <div>
      {
        tempArr.filter((item, index, arr) => index !== arr.length - 1).map((item, index) => {
          return (
            <span
              key={index}
              className={styles.six}
              style={{ backgroundColor: markSixColor[item] }}
            >
            {item}
          </span>);
        })
      }
      <span style={{ fontSize: 20 }}> + </span>
      <span
        className={styles.six}
        style={{ backgroundColor: markSixColor[lastNumber] }}
      > {lastNumber} </span>
    </div>
  );
}

function erba(number) {
  const tempArr = number.split(',');
  const sum = tempArr.reduce((prev, next) => +prev + +next);
  return (
    <div className={styles.erba}>
      {
        tempArr.map((item, index) => {
          return <span key={index} className={styles.erbaNumber}> {item} </span>;
        })
      }
      <em> = </em>
      <span className={styles.erbaSum}> {sum} </span>
      <span> {getDXDS(sum, true)} </span>
    </div>
  );
}

function poker(number) {
  const tempArr = number.split(',');
  return (
    <div className={styles.poker}>
      {
        tempArr.map((item, index) => {
          const flower = item.substring(0, 1);
          let awardNumber = item.substring(1);

          if (awardNumber < 10 && awardNumber !== '01') {
            awardNumber = +awardNumber;
          } else if (awardNumber === '01') {
            awardNumber = 'A';
          } else {
            switch (awardNumber) {
              case '11':
                awardNumber = 'J';
                break;
              case '12':
                awardNumber = 'Q';
                break;
              case '13':
                awardNumber = 'K';
                break;
              default:
            }
          }

          return (
            <span
              key={index}
              style={{
                backgroundImage: `url(${pokerMap[flower - 1]}`,
                fontSize: 16,
                color: flower % 2 === 0 ? '#FF0000' : '#000'
              }}
            >
              {awardNumber}
            </span>
          );
        })
      }
    </div>
  );
}

const col = [
  {
    title: '彩种',
    dataIndex: 'gameNameInChinese',
    key: 'gameNameInChinese'
  },
  {
    title: '期号',
    dataIndex: 'planNo',
    key: 'planNo',
    render: (text) => `第${text}期`
  },
  {
    title: '开奖号码',
    dataIndex: 'openCode',
    key: 'openCode',
    render: (text, record) => {
      const uniqueId = record.gameUniqueId;
      const sscPattern = /SSC/;
      if (!text) {
        return <span className={styles.opening}> 正在开奖 </span>;
      } else {
        switch (uniqueId) {
          case 'MARK_SIX':
            return markSix(text);
          case 'HF_AHK3':
          case 'HF_GXK3':
            return k3(text);
          case 'HF_LFKLPK':
            return poker(text);
          case 'HF_BJ28':
          case 'HF_LF28':
            return erba(text);
          case sscPattern.test(uniqueId) && uniqueId :
            return ssc(text, true);
          default:
            return ssc(text);
        }
      }


      // if (!text) {
      //   return <span className={styles.opening}> 正在开奖... </span>;
      // } else if (record.gameUniqueId === 'MARK_SIX') {
      //   return six(text);
      // } else if (record.gameUniqueId === 'HF_AHK3' || record.gameUniqueId === 'HF_GXK3') {
      //   return k3(text);
      // } else if (record.gameUniqueId === 'HF_LFKLPK') {
      //   return poker(text);
      // } else if (record.gameUniqueId === 'HF_BJ28' || record.gameUniqueId === 'HF_LF28') {
      //   return erba(text);
      // } else {
      //   return ssc(text);
      // }
    }
  },
  {
    title: '开奖时间',
    dataIndex: 'openTime',
    key: 'openTime',
    render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
  },
];

function AwardTable(params) {
  const { dataSource } = params;

  return (
    <div className={styles.container}>
      <Table
        dataSource={dataSource}
        size="small"
        rowKey="gameNameInChinese"
        columns={col}
        pagination={false}
      />
    </div>
  );
}

export default AwardTable;
