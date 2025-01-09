// indicators.js
const { SMA, EMA, RSI } = require('technicalindicators');
const config = require('./config');

// Calculate indicator based on the selected strategy
const calculateIndicator = (data, period, strategy) => {
  switch (strategy) {
    case 'SMA':
      return SMA.calculate({ period, values: data });
    case 'EMA':
      return EMA.calculate({ period, values: data });
    case 'RSI':
      return RSI.calculate({ period, values: data });
    default:
      throw new Error('Unsupported strategy');
  }
};

// Implement signal logic
const checkForSignals = (data, shortIndicator, longIndicator, strategy) => {
  if (strategy === 'RSI') {
    const rsi = shortIndicator; // For RSI, shortIndicator is actually the RSI values
    const currentRSI = rsi[rsi.length - 1];
    const buySignal = currentRSI > config.rsiOversold;
    const sellSignal = currentRSI < config.rsiOverbought;
    return { buy: buySignal, sell: sellSignal };
  } else {
    if (shortIndicator.length < 2 || longIndicator.length < 2) return { buy: false, sell: false };
    const prevShort = shortIndicator[shortIndicator.length - 2];
    const prevLong = longIndicator[longIndicator.length - 2];
    const currentShort = shortIndicator[shortIndicator.length - 1];
    const currentLong = longIndicator[longIndicator.length - 1];

    const buySignal = prevShort <= prevLong && currentShort > currentLong;
    const sellSignal = prevShort >= prevLong && currentShort < currentLong;
    return { buy: buySignal, sell: sellSignal };
  }
};

module.exports = { calculateIndicator, checkForSignals };