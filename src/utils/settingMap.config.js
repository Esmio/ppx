/* eslint-disable quote-props, max-len, object-property-newline */
import * as type from '../utils/type.config';

/**
 * Created by Sam on 2016/12/28.
 * Copyright © 2016年 JX. All rights reserved.
 */

export const gamesMap = {
	UNKNOWN_ID: 0,
	HF_BJPK10: { gameNameInChinese: '北京PK10', gameSettingsMap: 'BJPK10' },
	HF_CQSSC: { gameNameInChinese: '重庆时时彩', gameSettingsMap: 'SSC' },
	HF_XJSSC: { gameNameInChinese: '新疆时时彩', gameSettingsMap: 'SSC' },
	HF_TJSSC: { gameNameInChinese: '天津时时彩', gameSettingsMap: 'SSC' },
	HF_JXSSC: { gameNameInChinese: '江西时时彩', gameSettingsMap: 'SSC' },
	HF_LFSSC: { gameNameInChinese: '二分时时彩', gameSettingsMap: 'SSC' },
	HF_SHSSL: { gameNameInChinese: '上海时时乐', gameSettingsMap: 'SSL' },
	HF_CQKL10F: { gameNameInChinese: '重庆快乐十分', gameSettingsMap: 'KL10F' },
	HF_TJKL10F: { gameNameInChinese: '天津快乐十分', gameSettingsMap: 'KL10F' },
	HF_GDKL10F: { gameNameInChinese: '广东快乐十分', gameSettingsMap: 'KL10F' },
	HF_GDD11: { gameNameInChinese: '广东11选5', gameSettingsMap: 'D11X5' },
	HF_AHD11: { gameNameInChinese: '安徽11选5', gameSettingsMap: 'D11X5' },
	HF_JXD11: { gameNameInChinese: '江西11选5', gameSettingsMap: 'D11X5' },
	HF_SDD11: { gameNameInChinese: '山东11选5', gameSettingsMap: 'D11X5' },
	HF_SHD11: { gameNameInChinese: '上海11选5', gameSettingsMap: 'D11X5' },
	X3D: { gameNameInChinese: '福彩3D', gameSettingsMap: 'D3' },
	MARK_SIX: { gameNameInChinese: '六合彩', gameSettingsMap: 'MarkSix' },
	HF_LFPK10: { gameNameInChinese: '二分PK拾', gameSettingsMap: 'BJPK10' },
	HF_LFD11: { gameNameInChinese: '二分11选5', gameSettingsMap: 'D11X5' },
	HF_SG28: { gameNameInChinese: '新加坡28', gameSettingsMap: 'HF28' },
	HF_BJ28: { gameNameInChinese: '北京28', gameSettingsMap: 'HF28' },
	PL3: { gameNameInChinese: '排列3', gameSettingsMap: 'PL' },
	HF_AHK3: { gameNameInChinese: '安徽快3', gameSettingsMap: 'K3' },
	HF_GXK3: { gameNameInChinese: '广西快3', gameSettingsMap: 'K3' },
	HF_JSK3: { gameNameInChinese: '江苏快3', gameSettingsMap: 'K3' },
};

export const gameSettingsMap = {
	SSC: {
		'定位胆': { gameId: 'DN',
			gameSetCombination: {
				sections: type.UNITS_W_Q_B_S_G, set: type.NUM_0_9,
				formula: type.SINGLE, minimumRowPick: 1, pickRange: ['1-10', '1-10', '1-10', '1-10', '1-10']
			}
		},
		'五星-五星直选': { gameId: 'D5',
			gameSetCombination: {
				sections: type.UNITS_W_Q_B_S_G, set: type.NUM_0_9,
				formula: type.DUPLEX, minimumRowPick: 5, pickRange: ['1-10', '1-10', '1-10', '1-10', '1-10']
			}
		},
		'五星-五星通选': { gameId: 'C5',
			gameSetCombination: {
				sections: type.UNITS_W_Q_B_S_G, set: type.NUM_0_9,
				formula: type.DUPLEX, minimumRowPick: 5, pickRange: ['1-10', '1-10', '1-10', '1-10', '1-10']
			}
		},

		'三星-三星直选': { gameId: 'D3',
			gameSetCombination: {
				sections: type.UNITS_B_S_G, set: type.NUM_0_9,
				formula: type.DUPLEX, minimumRowPick: 3, pickRange: ['1-10', '1-10', '1-10']
			}
		},
		'三星-三星组三': { gameId: 'C33',
			gameSetCombination: {
				sections: type.PICK_NUM, set: type.NUM_0_9,
				formula: type.GROUP_3, minimumRowPick: 1, pickRange: ['2-10']
			}
		},
		'三星-三星组六': { gameId: 'C36',
			gameSetCombination: {
				sections: type.PICK_NUM, set: type.NUM_0_9,
				formula: type.GROUP_6, minimumRowPick: 1, pickRange: ['3-10']
			}
		},

		'二星-二星直选': { gameId: 'D2',
			gameSetCombination: {
				sections: type.UNITS_S_G, set: type.NUM_0_9,
				formula: type.DUPLEX, minimumRowPick: 2, pickRange: ['1-10', '1-10']
			}
		},
		'二星-二星组选': { gameId: 'C2',
			gameSetCombination: {
				sections: type.PICK_NUM, set: type.NUM_0_9, uniqueInt: 2,
				formula: type.GROUP_2, minimumRowPick: 1, pickRange: ['2-10']
			}
		},
		'大小单双-后二大小单双': { gameId: 'DXDS',
			gameSetCombination: {
				sections: type.UNITS_S_G, set: type.BS_DS,
				formula: type.DUPLEX, minimumRowPick: 2, pickRange: ['1-4', '1-4']
			}
		},
		'大小单双-后三大小单双': { gameId: 'DXDS_H3',
			gameSetCombination: {
				sections: type.UNITS_B_S_G, set: type.BS_DS,
				formula: type.DUPLEX, minimumRowPick: 3, pickRange: ['1-4', '1-4', '1-4']
			}
		},
		'大小单双-前二大小单双': { gameId: 'DXDS_Q2',
			gameSetCombination: {
				sections: type.UNITS_W_Q, set: type.BS_DS,
				formula: type.DUPLEX, minimumRowPick: 2, pickRange: ['1-4', '1-4']
			}
		},
		'大小单双-前三大小单双': { gameId: 'DXDS_Q3',
			gameSetCombination: {
				sections: type.UNITS_W_Q_B, set: type.BS_DS,
				formula: type.DUPLEX, minimumRowPick: 3, pickRange: ['1-4', '1-4', '1-4']
			}
		},

		'不定位-前三一码-一码': { gameId: 'BDW_Q31',
			gameSetCombination: {
				sections: type.UNFIX, set: type.NUM_0_9,
				formula: type.SINGLE, minimumRowPick: 1, pickRange: ['1-10']
			}
		},
		'不定位-前三二码-二码': { gameId: 'BDW_Q32',
			gameSetCombination: {
				sections: type.UNFIX, set: type.NUM_0_9, uniqueInt: 2,
				formula: type.GROUP_2, minimumRowPick: 1, pickRange: ['2-10']
			}
		},
		'不定位-后三一码-一码': { gameId: 'BDW_H31',
			gameSetCombination: {
				sections: type.UNFIX, set: type.NUM_0_9,
				formula: type.SINGLE, minimumRowPick: 1, pickRange: ['1-10']
			}
		},
		'不定位-后三二码-二码': { gameId: 'BDW_H32',
			gameSetCombination: {
				sections: type.UNFIX, set: type.NUM_0_9, uniqueInt: 2, 
				formula: type.GROUP_2, minimumRowPick: 1, pickRange: ['2-10']
			}
		},
		'不定位-前四一码-一码': { gameId: 'BDW_Q41',
			gameSetCombination: {
				sections: type.UNFIX, set: type.NUM_0_9,
				formula: type.SINGLE, minimumRowPick: 1, pickRange: ['1-10']
			}
		},
		'不定位-前四二码-二码': { gameId: 'BDW_Q42',
			gameSetCombination: {
				sections: type.UNFIX, set: type.NUM_0_9, uniqueInt: 2,
				formula: type.GROUP_2, minimumRowPick: 1, pickRange: ['2-10']
			}
		},
		'不定位-后四一码-一码': { gameId: 'BDW_H41',
			gameSetCombination: {
				sections: type.UNFIX, set: type.NUM_0_9,
				formula: type.SINGLE, minimumRowPick: 1, pickRange: ['1-10']
			}
		},
		'不定位-后四二码-二码': { gameId: 'BDW_H42',
			gameSetCombination: {
				sections: type.UNFIX, set: type.NUM_0_9, uniqueInt: 2,
				formula: type.GROUP_2, minimumRowPick: 1, pickRange: ['2-10']
			}
		},
		'不定位-五星一码-一码': { gameId: 'BDW_Q51',
			gameSetCombination: {
				sections: type.UNFIX, set: type.NUM_0_9,
				formula: type.SINGLE, minimumRowPick: 1, pickRange: ['1-10']
			}
		},
		'不定位-五星二码-二码': { gameId: 'BDW_Q52',
			gameSetCombination: {
				sections: type.UNFIX, set: type.NUM_0_9, uniqueInt: 2,
				formula: type.GROUP_2, minimumRowPick: 1, pickRange: ['2-10']
			}
		},
		'不定位-五星三码-三码': { gameId: 'BDW_Q53',
			gameSetCombination: {
				sections: type.UNFIX, set: type.NUM_0_9,
				formula: type.DIRECT_COMBINE, minimumRowPick: 1, pickRange: ['3-10']
			}
		},
		'任选二-直选复式-复式': { gameId: 'R2Z',
			gameSetCombination: {
				sections: type.UNITS_W_Q_B_S_G, set: type.NUM_0_9,
				formula: type.COMBO_DUPLEX, minimumRowPick: 2, pickRange: ['1-10', '1-10', '1-10', '1-10', '1-10']
			}
		},
		'任选二-直选和值-和值': { gameId: 'R2Z_HZ',
			gameSetCombination: {
				sections: type.SUM_VALUES, set: type.NUM_0_18, openOptions: type.UNITS_W_Q_B_S_G,
				formula: type.SUM__OPEN, minimumRowPick: 1, pickRange: ['1-19'], uniqueInt: 2
			}
		},
		'任选二-组选复式-复式': { gameId: 'R2C',
			gameSetCombination: {
				sections: type.PICK_GROUP, set: type.NUM_0_9, openOptions: type.UNITS_W_Q_B_S_G,
				formula: type.GROUP_2__OPEN, minimumRowPick: 1, pickRange: ['2-10'], uniqueInt: 2, 
			}
		},
		'任选二-组选和值-和值': { gameId: 'R2C_HZ',
			gameSetCombination: {
				sections: type.SUM_VALUES, set: type.NUM_0_18, openOptions: type.UNITS_W_Q_B_S_G,
				formula: type.SUM__OPEN, minimumRowPick: 1, pickRange: ['1-19'], uniqueInt: 2
			}
		},
		'任选三-直选复式-复式': { gameId: 'R3Z',
			gameSetCombination: {
				sections: type.UNITS_W_Q_B_S_G, set: type.NUM_0_9,
				formula: type.COMBO_DUPLEX, minimumRowPick: 3, pickRange: ['1-10', '1-10', '1-10', '1-10', '1-10']
			}
		},
		'任选三-直选和值-和值': { gameId: 'R3Z_HZ',
			gameSetCombination: {
				sections: type.SUM_VALUES, set: type.NUM_0_27, openOptions: type.UNITS_W_Q_B_S_G,
				formula: type.SUM__OPEN, minimumRowPick: 1, pickRange: ['1-28'], uniqueInt: 3
			}
		},
		'任选三-组三复式-复式': { gameId: 'R3C3',
			gameSetCombination: {
				sections: type.PICK_NUM, set: type.NUM_0_9, openOptions: type.UNITS_W_Q_B_S_G,
				formula: type.GROUP_3__OPEN, minimumRowPick: 1, pickRange: ['2-10'], uniqueInt: 3
			}
		},
		'任选三-组六复式-复式': { gameId: 'R3C6',
			gameSetCombination: {
				sections: type.PICK_NUM, set: type.NUM_0_9, openOptions: type.UNITS_W_Q_B_S_G,
				formula: type.GROUP_6__OPEN, minimumRowPick: 1, pickRange: ['3-10'], uniqueInt: 3
			}
		},
		'任选三-组选和值-和值': { gameId: 'R3C_HZ',
			gameSetCombination: {
				sections: type.SUM_VALUES, set: type.NUM_0_27, openOptions: type.UNITS_W_Q_B_S_G,
				formula: type.SUM__OPEN, minimumRowPick: 1, pickRange: ['1-28'], uniqueInt: 3
			}
		},
		'任选四-直选复式-复式': { gameId: 'R4Z',
			gameSetCombination: {
				sections: type.UNITS_W_Q_B_S_G, set: type.NUM_0_9,
				formula: type.COMBO_DUPLEX, minimumRowPick: 4, pickRange: ['1-10', '1-10', '1-10', '1-10', '1-10']
			}
		},
		'任选四-组选24': { gameId: 'R4C24',
			gameSetCombination: {
				sections: type.PICK_GROUP_24, set: type.NUM_0_9, openOptions: type.UNITS_W_Q_B_S_G,
				formula: type.GROUP_PICK_24__OPEN, minimumRowPick: 1, pickRange: ['4-10'], uniqueInt: 4
			}
		},
		'任选四-组选12': { gameId: 'R4C12',
			gameSetCombination: {
				sections: type.DOUBLE_SINGLE_NUM, set: type.NUM_0_9, openOptions: type.UNITS_W_Q_B_S_G,
				formula: type.GROUP_PICK_12__OPEN, minimumRowPick: 2, pickRange: ['1-10', '2-10'], uniqueInt: 4
			}
		},
		'任选四-组选6': { gameId: 'R4C6',
			gameSetCombination: {
				sections: type.TRIPLE_SINGLE_NUM, set: type.NUM_0_9, openOptions: type.UNITS_W_Q_B_S_G,
				formula: type.GROUP_PICK_6__OPEN, minimumRowPick: 1, pickRange: ['2-10'], uniqueInt: 4
			}
		},
		'任选四-组选4': { gameId: 'R4C4',
			gameSetCombination: {
				sections: type.DOUBLE_NUM, set: type.NUM_0_9, openOptions: type.UNITS_W_Q_B_S_G, isUnique: true,
				formula: type.GROUP_PICK_4__OPEN, minimumRowPick: 2, pickRange: ['1-10', '1-10'], uniqueInt: 4
			}
		},
	},
	SSL: {
		'二星-前二直选-直选': { gameId: 'F2IO',
			gameSetCombination: {
				sections: type.UNITS_B_S, set: type.NUM_0_9,
				formula: type.DUPLEX, minimumRowPick: 2, pickRange: ['1-10', '1-10'],
			}
		},
		'二星-前二组选-组选': { gameId: 'F2',
			gameSetCombination: {
				sections: type.PICK_NUM, set: type.NUM_0_9, uniqueInt: 2,
				formula: type.GROUP_2, minimumRowPick: 1, pickRange: ['2-10']
			}
		},
		'二星-后二直选-直选': { gameId: 'L2IO',
			gameSetCombination: {
				sections: type.UNITS_S_G, set: type.NUM_0_9,
				formula: type.DUPLEX, minimumRowPick: 2, pickRange: ['1-10', '1-10'],
			}
		},
		'二星-后二组选-组选': { gameId: 'L2',
			gameSetCombination: {
				sections: type.PICK_NUM, set: type.NUM_0_9, uniqueInt: 2,
				formula: type.GROUP_2, minimumRowPick: 1, pickRange: ['2-10']
			}
		},
		'三星-直选复式-复式': { gameId: 'NIO3',
			gameSetCombination: {
				sections: type.UNITS_B_S_G, set: type.NUM_0_9,
				formula: type.COMBO_DUPLEX, minimumRowPick: 3, pickRange: ['1-10', '1-10', '1-10']
			}
		},
		'三星-直选和值-和值': { gameId: 'NS3',
			gameSetCombination: {
				sections: type.SUM_VALUES, set: type.NUM_1_26,
				formula: type.SUM, minimumRowPick: 1, pickRange: ['1-26'],
			}
		},
		'三星-组三复式-复式': { gameId: 'GRP3',
			gameSetCombination: {
				sections: type.PICK_NUM, set: type.NUM_0_9, uniqueInt: 3,
				formula: type.GROUP_3, minimumRowPick: 1, pickRange: ['2-10']
			}
		},
		'三星-组三和值-和值': { gameId: 'G3S',
			gameSetCombination: {
				sections: type.SUM_VALUES, set: type.NUM_1_26,
				formula: type.SUM, minimumRowPick: 1, pickRange: ['1-26'],
			}
		},
		'三星-组六复式-复式': { gameId: 'GRP6',
			gameSetCombination: {
				sections: type.PICK_NUM, set: type.NUM_0_9, uniqueInt: 3,
				formula: type.GROUP_6, minimumRowPick: 1, pickRange: ['3-10']
			}
		},
		'三星-组六和值-和值': { gameId: 'G6S',
			gameSetCombination: {
				sections: type.SUM_VALUES, set: type.NUM_3_24,
				formula: type.SUM, minimumRowPick: 1, pickRange: ['1-22'],
			}
		},
		'不定位-一码不定位': { gameId: 'NS1P',
			gameSetCombination: {
				sections: type.UNFIX, set: type.NUM_0_9,
				formula: type.SINGLE, minimumRowPick: 1, pickRange: ['1-10']
			}
		},
		'不定位-二码不定位': { gameId: 'NS2P',
			gameSetCombination: {
				sections: type.UNFIX, set: type.NUM_0_9, uniqueInt: 2, 
				formula: type.GROUP_2, minimumRowPick: 1, pickRange: ['2-10']
			}
		},
		'大小单双-前二大小单双': { gameId: 'F2BSOE',
			gameSetCombination: {
				sections: type.UNITS_B_S, set: type.BS_DS,
				formula: type.DUPLEX, minimumRowPick: 2, pickRange: ['1-4', '1-4']
			}
		},
		'大小单双-后二大小单双': { gameId: 'L2BSOE',
			gameSetCombination: {
				sections: type.UNITS_S_G, set: type.BS_DS,
				formula: type.DUPLEX, minimumRowPick: 2, pickRange: ['1-4', '1-4']
			}
		},
		'定位胆': { gameId: 'SP',
			gameSetCombination: {
				sections: type.UNITS_B_S_G, set: type.NUM_0_9,
				formula: type.SINGLE, minimumRowPick: 1, pickRange: ['1-10', '1-10', '1-10']
			}
		}
	},
	BJPK10: {
		'定位胆': { gameId: 'DN',
			gameSetCombination: {
				sections: type.ALL_RANK, set: type.LEADNUM_1_10,
				formula: type.SINGLE,
				minimumRowPick: 1,
				pickRange: [
					'1-10', '1-10', '1-10', '1-10', '1-10',
					'1-10', '1-10', '1-10', '1-10', '1-10'
				]
			}
		},
		'前一': { gameId: 'D1',
			gameSetCombination: {
				sections: type.TOP_ONE_RANK, set: type.LEADNUM_1_10,
				formula: type.DUPLEX, minimumRowPick: 1, pickRange: ['1-10']
			}
		},
		'前二': { gameId: 'GT2',
			gameSetCombination: {
				sections: type.TOP_TWO_RANK, set: type.LEADNUM_1_10, isUnique: true,
				formula: type.TOP_TWO_BET, minimumRowPick: 2, pickRange: ['1-10', '1-10']
			}
		},
		'前三': { gameId: 'GT3',
			gameSetCombination: {
				sections: type.TOP_THREE_RANK, set: type.LEADNUM_1_10, isUnique: true,
				formula: type.TOP_THREE_BET, minimumRowPick: 3, pickRange: ['1-10', '1-10', '1-10']
			}
		},
	},
	D11X5: {
		'直选-前一直选': { gameId: 'Q1Z',
			gameSetCombination: {
				sections: type.UNITS_W, set: type.LEADNUM_1_11, isUnique: true,
				formula: type.DUPLEX, minimumRowPick: 1, pickRange: ['1-11']
			}
		},
		'直选-前二直选': { gameId: 'Q2Z',
			gameSetCombination: {
				sections: type.UNITS_W_Q, set: type.LEADNUM_1_11, isUnique: true,
				formula: type.TOP_TWO_BET, minimumRowPick: 2, pickRange: ['1-11', '1-11']
			}
		},
		'直选-前三直选': { gameId: 'Q3Z',
			gameSetCombination: {
				sections: type.UNITS_W_Q_B, set: type.LEADNUM_1_11, isUnique: true,
				formula: type.TOP_THREE_BET, minimumRowPick: 3, pickRange: ['1-11', '1-11', '1-11']
			}
		},
		'组选-前二组选': { gameId: 'Q2C',
			gameSetCombination: {
				sections: type.PICK_NUM, set: type.LEADNUM_1_11,
				formula: type.DIRECT_COMBINE, minimumRowPick: 1, pickRange: ['2-11']
			}
		},
		'组选-前三组选': { gameId: 'Q3C',
			gameSetCombination: {
				sections: type.PICK_NUM, set: type.LEADNUM_1_11,
				formula: type.DIRECT_COMBINE, minimumRowPick: 1, pickRange: ['3-11']
			}
		},
		'组选-前二组选-胆拖': { gameId: 'Q2CDT',
			gameSetCombination: {
				sections: type.DIRECT_PICK_PULL, set: type.LEADNUM_1_11, isUnique: true, uniqueInt: 2,
				formula: type.DIRECT_PICK_PULL_BET, minimumRowPick: 2, pickRange: ['1-1', '1-11']
			}
		},
		'组选-前三组选-胆拖': { gameId: 'Q3CDT',
			gameSetCombination: {
				sections: type.DIRECT_PICK_PULL, set: type.LEADNUM_1_11, isUnique: true, uniqueInt: 3,
				formula: type.DIRECT_PICK_PULL_BET, minimumRowPick: 2, pickRange: ['2-2', '1-11']
			}
		},
		'任选-任选二': { gameId: 'R2',
			gameSetCombination: {
				sections: type.PICK_NUM, set: type.LEADNUM_1_11,
				formula: type.DIRECT_COMBINE, minimumRowPick: 1, pickRange: ['2-11']
			}
		},
		'任选-任选二-胆拖': { gameId: 'R2DT',
			gameSetCombination: {
				sections: type.DIRECT_PICK_PULL, set: type.LEADNUM_1_11, isUnique: true, uniqueInt: 2,
				formula: type.DIRECT_PICK_PULL_BET, minimumRowPick: 2, pickRange: ['1-1', '1-11']
			}
		},
		'任选-任选三': { gameId: 'R3',
			gameSetCombination: {
				sections: type.PICK_NUM, set: type.LEADNUM_1_11,
				formula: type.DIRECT_COMBINE, minimumRowPick: 1, pickRange: ['3-11']
			}
		},
		'任选-任选三-胆拖': { gameId: 'R3DT',
			gameSetCombination: {
				sections: type.DIRECT_PICK_PULL, set: type.LEADNUM_1_11, isUnique: true, uniqueInt: 3,
				formula: type.DIRECT_PICK_PULL_BET, minimumRowPick: 2, pickRange: ['2-2', '1-11']
			}
		},
		'任选-任选四': { gameId: 'R4',
			gameSetCombination: {
				sections: type.PICK_NUM, set: type.LEADNUM_1_11,
				formula: type.DIRECT_COMBINE, minimumRowPick: 1, pickRange: ['4-11']
			}
		},
		'任选-任选四-胆拖': { gameId: 'R4DT',
			gameSetCombination: {
				sections: type.DIRECT_PICK_PULL, set: type.LEADNUM_1_11, isUnique: true, uniqueInt: 4,
				formula: type.DIRECT_PICK_PULL_BET, minimumRowPick: 2, pickRange: ['3-3', '1-11']
			}
		},
		'任选-任选五': { gameId: 'R5',
			gameSetCombination: {
				sections: type.PICK_NUM, set: type.LEADNUM_1_11,
				formula: type.DIRECT_COMBINE, minimumRowPick: 1, pickRange: ['5-11']
			}
		},
		'任选-任选五-胆拖': { gameId: 'R5DT',
			gameSetCombination: {
				sections: type.DIRECT_PICK_PULL, set: type.LEADNUM_1_11, isUnique: true, uniqueInt: 5,
				formula: type.DIRECT_PICK_PULL_BET, minimumRowPick: 2, pickRange: ['4-4', '1-11']
			}
		},
		'任选-任选六': { gameId: 'R6',
			gameSetCombination: {
				sections: type.PICK_NUM, set: type.LEADNUM_1_11,
				formula: type.DIRECT_COMBINE, minimumRowPick: 1, pickRange: ['6-11']
			}
		},
		'任选-任选六-胆拖': { gameId: 'R6DT',
			gameSetCombination: {
				sections: type.DIRECT_PICK_PULL, set: type.LEADNUM_1_11, isUnique: true, uniqueInt: 6,
				formula: type.DIRECT_PICK_PULL_BET, minimumRowPick: 2, pickRange: ['5-5', '1-11']
			}
		},
		'任选-任选七': { gameId: 'R7',
			gameSetCombination: {
				sections: type.PICK_NUM, set: type.LEADNUM_1_11,
				formula: type.DIRECT_COMBINE, minimumRowPick: 1, pickRange: ['7-11']
			}
		},
		'任选-任选七-胆拖': { gameId: 'R7DT',
			gameSetCombination: {
				sections: type.DIRECT_PICK_PULL, set: type.LEADNUM_1_11, isUnique: true, uniqueInt: 7,
				formula: type.DIRECT_PICK_PULL_BET, minimumRowPick: 2, pickRange: ['6-6', '1-11']
			}
		},
		'任选-任选八': { gameId: 'R8',
			gameSetCombination: {
				sections: type.PICK_NUM, set: type.LEADNUM_1_11,
				formula: type.DIRECT_COMBINE, minimumRowPick: 1, pickRange: ['8-11']
			}
		},
		'任选-任选八-胆拖': { gameId: 'R8DT',
			gameSetCombination: {
				sections: type.DIRECT_PICK_PULL, set: type.LEADNUM_1_11, isUnique: true, uniqueInt: 8,
				formula: type.DIRECT_PICK_PULL_BET, minimumRowPick: 2, pickRange: ['7-7', '1-11']
			}
		},
	},
	MarkSix: {
		'特码-特码A': { gameId: 'SA',
			gameSetCombination: {
				sections: type.PICK_NUM, set: type.LEADNUM_1_49,
				formula: type.DUPLEX, minimumRowPick: 1, pickRange: ['1-49']
			}
		},
		'特码-特码B': { gameId: 'SB',
			gameSetCombination: {
				sections: type.PICK_NUM, set: type.LEADNUM_1_49,
				formula: type.DUPLEX, minimumRowPick: 1, pickRange: ['1-49']
			}
		},
		'特码-特码种类': { gameId: 'BS',
			gameSetCombination: {
				sections: type.CATEGORY, set: type.SPECIAL_SYMBOLICS,
				formula: type.DUPLEX, minimumRowPick: 1, pickRange: ['1-24']
			}
		},
		'特码-特码色波': { gameId: 'C',
			gameSetCombination: {
				sections: type.CATEGORY, set: type.COLOR_NUM,
				formula: type.DUPLEX, minimumRowPick: 1, pickRange: ['1-3']
			}
		},

		'色波-色波半波': { gameId: 'C',
			gameSetCombination: {
				sections: type.CATEGORY, set: type.MIX_TWO,
				formula: type.DUPLEX, minimumRowPick: 1, pickRange: ['1-12']
			}
		},
		'色波-色波半半波': { gameId: 'C',
			gameSetCombination: {
				sections: type.CATEGORY, set: type.MIX_THREE,
				formula: type.DUPLEX, minimumRowPick: 1, pickRange: ['1-12']
			}
		},
		'正码-正码选号': { gameId: 'NG',
			gameSetCombination: {
				sections: type.PICK_NUM, set: type.LEADNUM_1_49,
				formula: type.DUPLEX, minimumRowPick: 1, pickRange: ['1-49']
			}
		},
		'平特-平特一肖': { gameId: 'GSX',
			gameSetCombination: {
				sections: type.CATEGORY, set: type.SYMBOLICS,
				formula: type.DUPLEX, minimumRowPick: 1, pickRange: ['1-12']
			}
		},
		'平特-平特尾数': { gameId: 'GST',
			gameSetCombination: {
				sections: type.CATEGORY, set: type.TAIL_NUM,
				formula: type.DUPLEX, minimumRowPick: 1, pickRange: ['1-10']
			}
		},
		'特肖生肖': { gameId: 'SX',
			gameSetCombination: {
				sections: type.CATEGORY, set: type.SYMBOLICS,
				formula: type.DUPLEX, minimumRowPick: 1, pickRange: ['1-12']
			}
		},
		'头尾数': { gameId: 'SHT',
			gameSetCombination: {
				sections: type.CATEGORY, set: type.HEAD_TAIL_NUM,
				formula: type.DUPLEX, minimumRowPick: 1, pickRange: ['1-15']
			}
		},
		'五行': { gameId: 'FX',
			gameSetCombination: {
				sections: type.CATEGORY, set: type.FIVE_ELEMENTS,
				formula: type.DUPLEX, minimumRowPick: 1, pickRange: ['1-5']
			}
		},
		'正肖生肖': { gameId: 'GX',
			gameSetCombination: {
				sections: type.CATEGORY, set: type.SYMBOLICS,
				formula: type.DUPLEX, minimumRowPick: 1, pickRange: ['1-12']
			}
		},
		'种类-7色波种类': { gameId: 'SC',
			gameSetCombination: {
				sections: type.CATEGORY, set: type.COLOR_THREE,
				formula: type.DUPLEX, minimumRowPick: 1, pickRange: ['1-3']
			}
		},
		'种类-总肖种类': { gameId: 'XC',
			gameSetCombination: {
				sections: type.CATEGORY, set: type.TOTAL_SYMBOLICS,
				formula: type.DUPLEX, minimumRowPick: 1, pickRange: ['1-8']
			}
		},
	},
	D3: {
		'3D直选': { gameId: 'NIO3',
			gameSetCombination: {
				sections: type.UNITS_B_S_G, set: type.NUM_0_9,
				formula: type.DUPLEX, minimumRowPick: 3, pickRange: ['1-10', '1-10', '1-10']
			}
		},
		'3D组三复式': { gameId: 'GRP3',
			gameSetCombination: {
				sections: type.PICK_NUM, set: type.NUM_0_9,
				formula: type.GROUP_3, minimumRowPick: 1, pickRange: ['2-10']
			}
		},
		'3D组六': { gameId: 'GRP6',
			gameSetCombination: {
				sections: type.PICK_NUM, set: type.NUM_0_9,
				formula: type.GROUP_6, minimumRowPick: 1, pickRange: ['3-10']
			}
		}
	},
	KL10F: {
		'首位-首位数投': { gameId: 'ST1',
			gameSetCombination: {
				sections: type.FIRST, set: type.LEADNUM_1_18,
				formula: type.DUPLEX, minimumRowPick: 1, pickRange: ['1-18']
			}
		},
		'首位-首位红投': { gameId: 'RT1',
			gameSetCombination: {
				sections: type.PUPOLAR_PICK, set: type.LEADNUM_19_20,
				formula: type.DUPLEX, minimumRowPick: 1, pickRange: ['1-2']
			}
		},

		'二连-二连直': { gameId: 'DC2',
			gameSetCombination: {
				sections: type.FRONT_BACK, set: type.LEADNUM_1_20, isUnique: true,
				formula: type.TOP_TWO_BET, minimumRowPick: 2, pickRange: ['1-20', '1-20']
			}
		},
		'二连-二连组': { gameId: 'CC2',
			gameSetCombination: {
				sections: type.GROUP_TWO, set: type.LEADNUM_1_20,
				formula: type.DIRECT_COMBINE, minimumRowPick: 1, pickRange: ['2-20']
			}
		},

		'前三-前三直': { gameId: 'DT3',
			gameSetCombination: {
				sections: type.TOP_THREE_PLACE, set: type.LEADNUM_1_20, isUnique: true,
				formula: type.TOP_THREE_BET, minimumRowPick: 3, pickRange: ['1-20', '1-20', '1-20']
			}
		},
		'前三-前三组': { gameId: 'CT3',
			gameSetCombination: {
				sections: type.GROUP_THREE, set: type.LEADNUM_1_20,
				formula: type.DIRECT_COMBINE, minimumRowPick: 1, pickRange: ['3-20']
			}
		},

		'快乐-快乐二': { gameId: 'KL2',
			gameSetCombination: {
				sections: type.HAPPY_TWO, set: type.LEADNUM_1_20,
				formula: type.DIRECT_COMBINE, minimumRowPick: 1, pickRange: ['2-20']
			}
		},
		'快乐-快乐三': { gameId: 'KL3',
			gameSetCombination: {
				sections: type.HAPPY_THREE, set: type.LEADNUM_1_20,
				formula: type.DIRECT_COMBINE, minimumRowPick: 1, pickRange: ['3-20']
			}
		},
		'快乐-快乐四': { gameId: 'KL4',
			gameSetCombination: {
				sections: type.HAPPY_FOUR, set: type.LEADNUM_1_20,
				formula: type.DIRECT_COMBINE, minimumRowPick: 1, pickRange: ['4-20']
			}
		},
		'快乐-快乐五': { gameId: 'KL5',
			gameSetCombination: {
				sections: type.HAPPY_FIVE, set: type.LEADNUM_1_20,
				formula: type.DIRECT_COMBINE, minimumRowPick: 1, pickRange: ['5-20']
			}
		}
	},
	HF28: {
		'混合': { gameId: 'MIX',
			gameSetCombination: {
				sections: type.MIX, set: type.BS_DS_EXTEND,
				formula: type.SINGLE, minimumRowPick: 1, pickRange: ['1-10']
			}
		},
		'特码': { gameId: 'SP',
			gameSetCombination: {
				sections: type.SPECIAL_NUM, set: type.NUM_0_27,
				formula: type.SINGLE, minimumRowPick: 1, pickRange: ['1-28']
			}
		},
		'特码-包三': { gameId: 'SP3',
			gameSetCombination: {
				sections: type.BUNDLE_THREE, set: type.NUM_0_27, isUnique: true,
				formula: type.BUNDLE, minimumRowPick: 1, pickRange: ['3-3']
			}
		},
		'波色': { gameId: 'BS',
			gameSetCombination: {
				sections: type.COLOR_BALL, set: type.COLOR_THREE,
				formula: type.SINGLE, minimumRowPick: 1, pickRange: ['1-3']
			}
		},
		'豹子': { gameId: 'BZ',
			gameSetCombination: {
				sections: type.LEOPARD, set: type.LEOPARD,
				formula: type.SINGLE, minimumRowPick: 1, pickRange: ['1-1']
			}
		}
	},
	PL: {
		'三星-三星组三': { gameId: 'GRP3',
			gameSetCombination: {
				sections: type.PICK_NUM, set: type.NUM_0_9,
				formula: type.GROUP_3, minimumRowPick: 1, pickRange: ['2-10']
			}
		},
		'三星-三星组三-和值': { gameId: 'G3S',
			gameSetCombination: {
				sections: type.SUM_VALUES, set: type.NUM_1_26,
				formula: type.SUM, minimumRowPick: 1, pickRange: ['1-26'],
			}
		},
		'三星-三星组六': { gameId: 'GRP6',
			gameSetCombination: {
				sections: type.PICK_NUM, set: type.NUM_0_9,
				formula: type.GROUP_6, minimumRowPick: 1, pickRange: ['3-10']
			}
		},
		'三星-三星组六-和值': { gameId: 'G6S',
			gameSetCombination: {
				sections: type.SUM_VALUES, set: type.NUM_3_24,
				formula: type.SUM, minimumRowPick: 1, pickRange: ['1-22'],
			}
		},
		'三星-三星直选': { gameId: 'NIO3',
			gameSetCombination: {
				sections: type.UNITS_B_S_G, set: type.NUM_0_9,
				formula: type.DUPLEX, minimumRowPick: 3, pickRange: ['1-10', '1-10', '1-10']
			}
		},
		'三星-三星直选-和值': { gameId: 'NS3',
			gameSetCombination: {
				sections: type.SUM_VALUES, set: type.NUM_0_27,
				formula: type.SUM, minimumRowPick: 1, pickRange: ['1-28'],
			}
		},
		'二星-前二组选': { gameId: 'F2',
			gameSetCombination: {
				sections: type.PICK_NUM, set: type.NUM_0_9, uniqueInt: 2,
				formula: type.GROUP_2, minimumRowPick: 1, pickRange: ['2-10']
			}
		},
		'二星-前二直选': { gameId: 'F2IO',
			gameSetCombination: {
				sections: type.UNITS_S_G, set: type.NUM_0_9,
				formula: type.DUPLEX, minimumRowPick: 2, pickRange: ['1-10', '1-10']
			}
		},
		'二星-后二组选': { gameId: 'L2',
			gameSetCombination: {
				sections: type.PICK_NUM, set: type.NUM_0_9, uniqueInt: 2,
				formula: type.GROUP_2, minimumRowPick: 1, pickRange: ['2-10']
			}
		},
		'二星-后二直选': { gameId: 'L2IO',
			gameSetCombination: {
				sections: type.UNITS_S_G, set: type.NUM_0_9,
				formula: type.DUPLEX, minimumRowPick: 2, pickRange: ['1-10', '1-10']
			}
		},
		'大小单双-前二大小单双': { gameId: 'F2BSOE',
			gameSetCombination: {
				sections: type.UNITS_W_Q, set: type.BS_DS,
				formula: type.DUPLEX, minimumRowPick: 2, pickRange: ['1-4', '1-4']
			}
		},
		'大小单双-后二大小单双': { gameId: 'L2BSOE',
			gameSetCombination: {
				sections: type.UNITS_S_G, set: type.BS_DS,
				formula: type.DUPLEX, minimumRowPick: 2, pickRange: ['1-4', '1-4']
			}
		},
		'不定位-一码不定位': { gameId: 'NS1P',
			gameSetCombination: {
				sections: type.UNFIX, set: type.NUM_0_9,
				formula: type.SINGLE, minimumRowPick: 1, pickRange: ['1-10']
			}
		},
		'不定位-二码不定位': { gameId: 'NS2P',
			gameSetCombination: {
				sections: type.UNFIX, set: type.NUM_0_9, uniqueInt: 2, 
				formula: type.GROUP_2, minimumRowPick: 1, pickRange: ['2-10']
			}
		},
		'定位胆': { gameId: 'SP',
			gameSetCombination: {
				sections: type.UNITS_B_S_G, set: type.NUM_0_9,
				formula: type.SINGLE, minimumRowPick: 1, pickRange: ['1-10', '1-10', '1-10']
			}
		},
	},
	K3: {
		'和值': { gameId: 'HZ',
			gameSetCombination: {
				sections: type.SUM_VALUES, set: type.NUM_3_18,
				formula: type.SINGLE, minimumRowPick: 1, pickRange: ['1-16']
			}
		},
		'猜一个号': { gameId: 'CYG',
			gameSetCombination: {
				sections: type.PICK_NUM, set: type.NUM_1_6, uniqueInt: 21,
				formula: type.DIRECT_MULTIPLY, minimumRowPick: 1, pickRange: ['1-6']
			}
		},
		'二不同号': { gameId: 'EBTH',
			gameSetCombination: {
				sections: type.PICK_NUM, set: type.NUM_1_6,
				formula: type.DIRECT_COMBINE, minimumRowPick: 1, pickRange: ['2-6']
			}
		},
		'二不同号-二不同号-胆拖': { gameId: 'EBTHDT',
			gameSetCombination: {
				sections: type.DIRECT_PICK_PULL, set: type.NUM_1_6, isUnique: true, uniqueInt: 2,
				formula: type.DIRECT_PICK_PULL_BET, minimumRowPick: 2, pickRange: ['1-1', '1-6'],
			}
		},
		'二同号-二同号单选': { gameId: 'ETHDX',
			gameSetCombination: {
				sections: type.SAME_UNSAME, set: type.DOUBLE_SAME_1_6, alternateSet: type.NUM_1_6,
				formula: type.DUPLEX, minimumRowPick: 2, pickRange: ['1-6', '1-6'], isUnique: true,
			}
		},
		'二同号-二同号复选': { gameId: 'ETHFX',
			gameSetCombination: {
				sections: type.PICK_NUM, set: type.DOUBLE_SAME_1_6__SINGLE, joinPickWith: [','], joinSectionWith: ',',
				formula: type.SINGLE, minimumRowPick: 1, pickRange: ['1-6']
			}
		},
		'三不同号': { gameId: 'SBTH',
			gameSetCombination: {
				sections: type.PICK_NUM, set: type.NUM_1_6,
				formula: type.DIRECT_COMBINE, minimumRowPick: 1, pickRange: ['3-6']
			}
		},
		'三同号-三同号单选': { gameId: 'STHDX',
			gameSetCombination: {
				sections: type.PICK_NUM, set: type.TRIPLE_SAME_1_6,
				formula: type.SINGLE, minimumRowPick: 1, pickRange: ['1-6']
			}
		},
		'三同号-三同号通选': { gameId: 'STHTX',
			gameSetCombination: {
				sections: type.PICK_ALL, set: type.TRIPLE_PICK_ALL,
				formula: type.SINGLE, minimumRowPick: 1, pickRange: ['1-1']
			}
		},
		'三连号-三连号通选': { gameId: 'SLHTX',
			gameSetCombination: {
				sections: type.PICK_ALL, set: type.TRIPLE_PICK_ALL,
				formula: type.SINGLE, minimumRowPick: 1, pickRange: ['1-1']
			}
		},
	},
	PCDD: {
		'混合': 'MIX',
		'波色': 'BS',
		'豹子': 'BZ',
		'特码-包三': 'SP3',
		'特码': 'SP'
	}
};
