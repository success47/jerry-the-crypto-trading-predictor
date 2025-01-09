const config = require('./config');

// Helper function to determine the trend
const determineTrend = (data) => {
  if (data.length < 2) return 'neutral';

  let trend = 'neutral';
  let higherHighs = 0;
  let higherLows = 0;
  let lowerHighs = 0;
  let lowerLows = 0;

  for (let i = 1; i < data.length; i++) {
    if (data[i].close > data[i - 1].close) {
      higherHighs++;
      higherLows++;
    } else if (data[i].close < data[i - 1].close) {
      lowerHighs++;
      lowerLows++;
    }
  }

  if (higherHighs > lowerHighs && higherLows > lowerLows) {
    trend = 'uptrend';
  } else if (lowerHighs > higherHighs && lowerLows > higherLows) {
    trend = 'downtrend';
  }

  return trend;
};

// Helper function to identify high probability order blocks
const identifyOrderBlocks = (data, trend) => {
  const orderBlocks = [];
  const lookbackPeriod = 10; // Number of periods to look back for identifying order blocks

  for (let i = lookbackPeriod; i < data.length; i++) {
    const currentRange = data.slice(i - lookbackPeriod, i);
    const high = Math.max(...currentRange.map(d => d.high));
    const low = Math.min(...currentRange.map(d => d.low));
    const mid = (high + low) / 2;

    // Calculate average volume over the lookback period
    const averageVolume = currentRange.reduce((sum, d) => sum + d.volume, 0) / lookbackPeriod;

    // Check if the current price is within the range
    if (data[i].close >= low && data[i].close <= high) {
      // Check for volume confirmation
      const volume = data[i].volume;

      if (volume > averageVolume) {
        orderBlocks.push({
          type: trend === 'uptrend' ? 'buy' : 'sell',
          price: mid,
          high,
          low,
          volume
        });
      }
    }
  }

  return orderBlocks;
};

// Helper function to determine entry and exit points
const determineEntryExitPoints = (orderBlocks) => {
  const entryPoints = [];
  const exitPoints = [];
  const riskRewardRatio = 2; // Example risk-reward ratio

  orderBlocks.forEach(block => {
    if (block.type === 'buy') {
      const entryPoint = block.low; // Entry just above the order block
      const exitPoint = entryPoint + (block.high - block.low) * riskRewardRatio; // Exit based on risk-reward ratio
      entryPoints.push(entryPoint);
      exitPoints.push(exitPoint);
    } else if (block.type === 'sell') {
      const entryPoint = block.high; // Entry just below the order block
      const exitPoint = entryPoint - (block.high - block.low) * riskRewardRatio; // Exit based on risk-reward ratio
      entryPoints.push(entryPoint);
      exitPoints.push(exitPoint);
    }
  });

  return { entryPoints, exitPoints };
};

// Implement SMC signal logic
const checkForSMCSignals = (data) => {
  const trend = determineTrend(data);
  const orderBlocks = identifyOrderBlocks(data, trend);
  const { entryPoints, exitPoints } = determineEntryExitPoints(orderBlocks);

  // Implement logic to generate buy and sell signals
  const currentPrice = data[data.length - 1].close;
  let buySignal = false;
  let sellSignal = false;

  if (trend === 'uptrend') {
    buySignal = entryPoints.some(entry => currentPrice < entry);
  } else if (trend === 'downtrend') {
    sellSignal = exitPoints.some(exit => currentPrice > exit);
  }

  if (buySignal) {
    return { buy: true, sell: false, signal: 'buy' };
  } else if (sellSignal) {
    return { buy: false, sell: true, signal: 'sell' };
  } else {
    return { buy: false, sell: false, signal: 'none' };
  }
};

module.exports = { checkForSMCSignals };