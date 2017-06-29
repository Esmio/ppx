import _ from 'lodash';
import { settingMap, getSymbolicName, type, cleanEmptyObj, getRandomInt } from '../utils/';
import { gameCalculation as calculation } from './gameCalculation';

export const ifSymbolicAware = (symbolic) => {
  return symbolic && type[`SYMBOLIC_${symbolic}`];
};

export const getAllGameSettings = (({ gameSettingsMap, gamesMap }, { selectedLotUniqueId }) => {
	// console.debug('getAllGameSettings', gameSettingsMap[gamesMap[gameUniqueId].gameSettingsMap]);
	return gameSettingsMap[gamesMap[selectedLotUniqueId].gameSettingsMap];
}).bind(this, settingMap);

export const getSingleGameSetting = (({
	gameSettingsMap, gamesMap
}, {
	selectedLotUniqueId, selectedGameName
}) => {
	const gameMap = gamesMap[selectedLotUniqueId];
	const settingMapKey = gameMap.gameSettingsMap;
	const gameSetting = gameSettingsMap[settingMapKey];
	let singleGameSetting = gameSetting[selectedGameName];
  let { gameSetCombination } = singleGameSetting;
  gameSetCombination = { ...gameSetCombination, selectedGameName };
  singleGameSetting = { ...singleGameSetting, gameSetCombination };
	return singleGameSetting;
}).bind(this, settingMap);

export const defineSymbolicPrize = (({ gamePrize, gameSetCombination }) => {
  const symbolicGamePrize = { ...gamePrize };
  const { prizeSettings } = symbolicGamePrize;
  const { set } = gameSetCombination;
  // console.debug('isSymbolicAware', ifSymbolicAware(symbolicGamePrize));
  const newPrizeSetting = [];
  const symbolicName = getSymbolicName(symbolicGamePrize.symbolic);
  const symbolicPrizeIndex = _.findIndex(prizeSettings, (setting) => {
    return (
      setting.prizeNameForDisplay.indexOf(symbolicName) >= 0 ||
      setting.prizeNameForDisplay.indexOf(type.SYMBOLIC_CURRENT_YEAR) >= 0
    );
  });
  const symbolicPrizeSetting = prizeSettings[symbolicPrizeIndex];
  const nonSymbolicPrizeSetting = prizeSettings[1];
  // console.debug(symbolicPrizeSetting, nonSymbolicPrizeSetting);
  _.forEach(set, (eachOption) => {
    let prizeSetting = { ...nonSymbolicPrizeSetting };
    if (eachOption === symbolicName) {
      prizeSetting = { ...symbolicPrizeSetting, prizeNameForDisplay: eachOption };
    }
    newPrizeSetting.push(prizeSetting); 
  });
  symbolicGamePrize.prizeSettings = [...newPrizeSetting];
  return symbolicGamePrize;
});

export const extractGamePrize = (({ singleGamePrizeSettings }, { gameId, gameSetCombination }) => {
  let gamePrize = { ...singleGamePrizeSettings[gameId] };
  if (ifSymbolicAware(gamePrize)) {
    gamePrize = defineSymbolicPrize({ gamePrize, gameSetCombination });
  }
  return gamePrize;
});

export const getRandomSections = (({ minimumRowPick, sections }) => {
  const maxInt = sections.length; 
  const randomSections = [];
  do {
    const randomSection = getRandomInt(0, maxInt);
    if (_.indexOf(randomSections, randomSection) < 0) {
      randomSections.push(randomSection);
    }
  } while (randomSections.length < minimumRowPick);
  return randomSections;
});

export const getRandomPicks = ((gameSetCombination) => {
  const { 
    pickRange, sections, set, isUnique, minimumRowPick, alternateSet
  } = gameSetCombination;
  const randomSections = getRandomSections({ minimumRowPick, sections });  
  const isGroupSelection = _.isArray(set[_.keys(set)[0]]);
  const allSectionKeys = _.keys(sections);
  const randomPicks = {};
  const existingIndexes = [];
  _.forEach(randomSections, (sectionIndex) => {
    const sectionName = sections[allSectionKeys[sectionIndex]];
    const currentIndexes = [];
    randomPicks[sectionName] = [];
    const useAlternate = alternateSet && sectionIndex > 0;
    const range = _.split(pickRange[sectionIndex], '-');
    const min = range[0];
    const max = isUnique ? set.length : range[1];
    do {
      const randomIndex = getRandomInt(0, max);
      const groupPick = _.split(_.keys(set)[randomIndex], '-')[0];
      const pick = useAlternate ? alternateSet[randomIndex] : set[randomIndex];
      if (isUnique && _.indexOf(existingIndexes, randomIndex) < 0) {
        existingIndexes.push(randomIndex);
        randomPicks[sectionName].push(isGroupSelection ? groupPick : pick);
        // console.debug('getting random picks...', existingIndexes);
      } else if (!isUnique && _.indexOf(currentIndexes, randomIndex) < 0) {
        currentIndexes.push(randomIndex);
        randomPicks[sectionName].push(isGroupSelection ? groupPick : pick);
      }
    } while (randomPicks[sectionName].length < min);
  });
  return randomPicks;
});

export const getNavOptions = (({ gameSettings }) => {
  const newNavOptions = {};
  _.forEach(gameSettings, (id, name) => {
    const gameNamesGroups = name.split('-');
    const navName = gameNamesGroups[0];
    const subGroupName = gameNamesGroups[2] || type.NORMAL;
    const singleGameName = gameNamesGroups[1] || navName;
    newNavOptions[navName] = newNavOptions[navName] || {};
    newNavOptions[navName][subGroupName] = newNavOptions[navName][subGroupName] || [];
    newNavOptions[navName][subGroupName].push(singleGameName);
  });
  return newNavOptions;
});

export const isValueExist = (({ gameName, sectionName, value, existingPicks }) => {
  return existingPicks &&
    existingPicks[gameName] &&
    existingPicks[gameName][sectionName] &&
    existingPicks[gameName][sectionName].indexOf(value) >= 0;
});

export const onlyShowOneAmount = ((prizeSettingsInstance) => {
  let condition = false;
  const firstPrizeSetting = _.find(
    prizeSettingsInstance, { prizeNameForDisplay: type.GRAND_PRIZE }
  );

  condition =
    (firstPrizeSetting !== null && firstPrizeSetting !== undefined) ||
    prizeSettingsInstance.length === 1;
    
  return condition;
});

export const getTheOnlyAmountOf = ((prizeSettingsInstance) => {
  if (onlyShowOneAmount(prizeSettingsInstance)) {
    const firstPrizeSetting =
      _.find(prizeSettingsInstance, { prizeNameForDisplay: type.GRAND_PRIZE }) ||
      prizeSettingsInstance[0];
    return firstPrizeSetting.prizeAmount;
  }
});

export const getOpenOptions = (({ existingOpenOptions, gameSetCombination, gameName }) => {
  const { openOptions, uniqueInt } = gameSetCombination;
  const newPicks = { ...existingOpenOptions };

  if (_.isArray(openOptions)) {
    const defaultOpenOptions = [];
    _.forEach(openOptions, (setting, index) => {
      if (index >= (openOptions.length - uniqueInt)) {
        defaultOpenOptions.push(index);
      }
    });
    newPicks[gameName] = newPicks[gameName] || defaultOpenOptions;
  }
  return newPicks;
});

export const storeOpenOptions = (({
  gameName, value, openOptions
}) => {
  const newPicks = { ...openOptions };
  newPicks[gameName] = newPicks[gameName] || [];
  if (newPicks[gameName].indexOf(value) >= 0) {
    const valueIndex = newPicks[gameName].indexOf(value);
    newPicks[gameName].splice(valueIndex, 1);
  } else if (newPicks[gameName].indexOf(value) < 0) {
    newPicks[gameName].push(value);
  }
  return newPicks;
});

export const getOpenOptionsString = ((currentOpenOptions) => {
  let optionsString = '';
  _.forEachRight(currentOpenOptions, (option) => {
    optionsString = `${optionsString} ${type.OPEN_OPTION_STRINGS[option]}`;
  });
  optionsString = _.trim(optionsString);
  return optionsString;
});

export function getBetString({ thisBetObj }, { sections, set }) {
  let thisBetString = '';
  _.forEach(sections, (section, index) => {
    const sectionJoiner = index === sections.length - 1 ? '' : '|';
    if (thisBetObj[section]) {
      let sectionStr = '';
      _.forEach(set, (betStr) => {
        if (thisBetObj[section].indexOf(betStr) > -1) {
          sectionStr = `${sectionStr} ${betStr}`;
        }
      });
      sectionStr = _.trim(sectionStr);
      thisBetString = `${thisBetString}${sectionStr}${sectionJoiner}`;
    } else {
      thisBetString = `${thisBetString}${sectionJoiner}`;
    }
  });
  thisBetString = _.trim(thisBetString);
  return thisBetString;
}

export const filterRepeat = (({
  currentGame, sectionName, set, alternateSet, currentSection
}) => {
  const newCurrentGame = { ...currentGame };
  _.forEach(newCurrentGame, (otherSection, otherSectionName) => {
    if (otherSectionName !== sectionName) {
      _.forEach(currentSection, (currentPick) => {
        const thisPickIndexInSet = _.indexOf(set, currentPick);
        const thisPickIndexInotherSet = _.indexOf(alternateSet, currentPick);

        let currentPickInSet = currentPick;
        let currentPickInOtherSet = currentPick;
        if (thisPickIndexInSet >= 0) {
          currentPickInSet = set[thisPickIndexInSet];
          currentPickInOtherSet = alternateSet[thisPickIndexInSet];
        } else if (thisPickIndexInotherSet >= 0) {
          currentPickInSet = alternateSet[thisPickIndexInotherSet];            
          currentPickInOtherSet = set[thisPickIndexInotherSet];
        }
        if (
          _.indexOf(newCurrentGame[otherSectionName], currentPickInSet) >= 0
        ) {
          const valueIndex = _.indexOf(newCurrentGame[otherSectionName], currentPickInSet);
          newCurrentGame[otherSectionName].splice(valueIndex, 1);
        } else if (
          _.indexOf(newCurrentGame[otherSectionName], currentPickInOtherSet) >= 0
        ) {
          const valueIndex = _.indexOf(newCurrentGame[otherSectionName], currentPickInOtherSet);
          newCurrentGame[otherSectionName].splice(valueIndex, 1);
        }
      });
    }
  });
  return newCurrentGame;
});

export const storeNewPicks = (({
  gameName, sectionName, value, existingPicks, gameSetCombination
}) => {
  const { pickRange, isUnique, sections, set } = gameSetCombination;
  const alternateSet = gameSetCombination.alternateSet || [];
  let newPicks = { ...existingPicks };
  let currentGame = newPicks[gameName] || {};
  const sectionIndex = _.indexOf(sections, sectionName);
  const range = _.split(pickRange[sectionIndex], '-');
  const maxPick = range[1];
  const valueIsArray = _.isArray(value);
  const valueNotArray = !_.isArray(value);

  _.forEach(sections, (section) => {
    currentGame[section] = currentGame[section] || [''];
  });

  let currentSection = currentGame[sectionName];
  const valueExist = currentSection.indexOf(value) >= 0;
  const valueNotExist = currentSection.indexOf(value) < 0;

  /* add value into section */
  if (valueExist) {
    const valueIndex = currentSection.indexOf(value);
    currentSection.splice(valueIndex, 1);
  } else if (valueNotArray && valueNotExist) {
    currentSection.push(value);
  } else if (valueIsArray) {
    currentSection = value;
  }

  /* remove extra value from section */
  if (currentSection.length > maxPick) {
    const sectionLength = currentSection.length;
    const dropLength = sectionLength - maxPick;
    currentSection = _.drop(currentSection, dropLength);
  }
  currentGame[sectionName] = currentSection;

  /* remove duplicate value from other array if Unique*/
  if (isUnique) { /* this is fucking stupid I don't know why I have to do this */
    currentGame = filterRepeat({
      currentSection,
      currentGame,
      sectionName,
      alternateSet,
      set,
    });
  }

  /* cleaning empty object */
  const newCurrentGame = cleanEmptyObj(currentGame);
  // console.debug(newCurrentGame);
  if (_.isEmpty(newCurrentGame)) {
    currentGame = newCurrentGame;
  }
  newPicks[gameName] = newCurrentGame;
  newPicks = cleanEmptyObj(newPicks);
  return newPicks;
});

export const getBetDetails = ((cart) => {
  let totalNumberOfUnits = 0;
  let totalAmount = 0;
  const betEntries = [];
  _.forEach(cart, item => {
    const { amount, numberOfUnits } = item.order;
    totalNumberOfUnits += numberOfUnits;
    totalAmount += amount;
    betEntries.push(item.order);
  });
  return { betEntries, totalNumberOfUnits, totalAmount };
});

export const getNumberOfUnits = (({
  thisMethodSetting, thisBetObj, thisOpenOption
}) => {
  function getEachPicksLength() {
    // console.log('getting each pick length', selectedGameSetting);
    const picksLength = [];
    _.forEach(this.gameSections, (section) => {
      let length = 0;
      _.forEach(this.thisBetObj[section], string => {
        if (string !== '') {
          length++;
        }
      });
      picksLength.push(length);
    });
    return picksLength;
  }

  function getValueRef(methodId) {
    return type.VALUE_REF[methodId];
  }

  function init() {
    this.gameRules = thisMethodSetting.gameRules;
    this.gameSections = this.gameRules.sections;
    this.formula = this.gameRules.formula;
    this.uniqueInt = this.gameRules.uniqueInt;
    this.isUnique = this.gameRules.isUnique;
    this.minimumRowPick = this.gameRules.minimumRowPick;
    this.pickRange = this.gameRules.pickRange;
    this.openOptions = this.gameRules.openOptions;
    this.valueRef = getValueRef(thisMethodSetting.methodId);
    this.openOptionsOnGame = thisOpenOption;
    this.isNotOpenOptions = _.isEmpty(this.valueRef) && _.isEmpty(this.openOptionsOnGame);
    this.isOpenOptions = !_.isEmpty(this.openOptions);
    this.thisBetObj = thisBetObj;
    this.picksLength = getEachPicksLength.call(this);
    this.setIsFullfilled = false;
    this.totalBet = 0;
    return this;
  }
  
  function validateSet() {
    // console.log('validating set');
    init.call(this);

    let condition = 0;
    _.forEach(this.picksLength, (length, index) => {
      const range = _.split(this.pickRange[index], '-');
      const min = range[0];
      const max = range[1];
      const conditionPassed = length >= min && length <= max;
        // console.log(range, min, max, length, conditionPassed);
      if (conditionPassed) {
        condition++;
      }
    });
    // console.debug(this.isOpenOptions, condition);
    this.setIsFullfilled = condition >= this.minimumRowPick;
    return this;
  }

  function calculateBet() {
    // console.log('calculating bet count');
    if (calculation[`${this.formula}`]) {
      this.totalBet = calculation[`${this.formula}`].calculate({
        minimumRowPick: this.minimumRowPick,
        openOptionsOnGame: this.openOptionsOnGame,
        pickRange: this.pickRange,
        picksLength: this.picksLength,
        thisBetObj: this.thisBetObj,
        setIsFulFilled: this.setIsFullfilled,
        valueRef: this.valueRef,
        uniqueInt: this.uniqueInt,
      });

      this.totalBet = this.isOpenOptions ? 
        this.totalBet.getOpenOptionsTotal() :
        this.totalBet.getTotal();
    }
    return this;
  }
  function getTotal() {
    return this.totalBet;
  }
  return { validate: validateSet, calculate: calculateBet, getTotal };
});

export const getBetQuantity = (({
  thisMethodSetting, thisBetObj, thisOpenOption
}) => {
  const betQuantity = getNumberOfUnits({
    thisMethodSetting, thisBetObj, thisOpenOption
  })
  .validate()
  .calculate()
  .getTotal();
  return betQuantity;
});

export const calculateBetAmount = ((existingBetAmount) => {
  let newTotalAmount = 0;
  _.map(type.UNITS, (unitMultiplier, unitName) => {
    newTotalAmount += existingBetAmount[unitName] * unitMultiplier;
  });
  return newTotalAmount;
});

export const getCalculateDetails = (({
  existingBetAmount,
  existingMultiply,
  existingOpenOptions,
  existingPicks,
  existingReturnRatio,
  selectedGameName,
  selectedGameSetting,
  gamePrize
}) => {
  const thisBetObj = existingPicks[selectedGameName] || {};
  const openOptionsOnGame = existingOpenOptions[selectedGameName];
  const numberOfUnits = getBetQuantity({
    selectedGameSetting, thisBetObj, openOptionsOnGame
  });
  const multiply = existingMultiply[selectedGameName] || 1;
  const currentReturnRatio = existingReturnRatio[selectedGameName] || 0;
  let pricePerUnit = calculateBetAmount(existingBetAmount[selectedGameName]);
  pricePerUnit *= multiply;
  let amount = pricePerUnit * numberOfUnits;
  amount = parseFloat(amount.toFixed(3));
  const { prizeSettings } = gamePrize;
  const prizeAmount = prizeSettings[0].prizeAmount;
  const firstPrizeName = prizeSettings[0].prizeNameForDisplay;
  const shouldShowPrize = firstPrizeName === type.GRAND_PRIZE && prizeAmount;
  let largestPrizeAmount = (pricePerUnit * prizeAmount) * (1 - currentReturnRatio);
  largestPrizeAmount = parseFloat(largestPrizeAmount.toFixed(3));
  largestPrizeAmount = shouldShowPrize ? largestPrizeAmount : '-';
  return {
    amount,
    largestPrizeAmount,
    numberOfUnits,
    pricePerUnit,
  };
});

