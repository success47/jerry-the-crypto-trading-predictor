// config.js
module.exports = {
    strategy: 'SMA', // Change to 'SMA', 'EMA', 'RSI', or 'SMC'
    shortPeriod: 5,  // 5 minutes for moving averages
    longPeriod: 60,  // 60 minutes for moving averages
    rsiPeriod: 14,   // 14 periods for RSI
    rsiOverbought: 70,
    rsiOversold: 30
  };