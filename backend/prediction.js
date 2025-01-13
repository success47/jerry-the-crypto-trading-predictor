const PredictionModel = require('./models/predictionModel');

class Prediction {
  constructor(signalHistory, priceData) {
    this.history = signalHistory;
    this.priceData = priceData;
  }

  // Helper method to determine price trend
  analyzePriceData() {
    const recentPrices = this.priceData.slice(-5); // Consider the last 5 price points
    const [first, ...rest] = recentPrices;
    const priceChanges = rest.map(price => price - first);

    const up = priceChanges.every(change => change > 0);
    const down = priceChanges.every(change => change < 0);

    if (up) return 'up';
    if (down) return 'down';
    return 'consolidating';
  }

  // Helper method to determine history trend
  analyzeHistory() {
    const recentHistory = this.history.slice(-5); // Get the last five entries

    const smaSignals = recentHistory.filter(signal => signal.strategy === 'SMA');
    const emaSignals = recentHistory.filter(signal => signal.strategy === 'EMA');
    const rsiSignals = recentHistory.filter(signal => signal.strategy === 'RSI');

    const buySignals = [...smaSignals, ...emaSignals, ...rsiSignals].filter(signal => signal.signal === 'buy').length;
    const sellSignals = [...smaSignals, ...emaSignals, ...rsiSignals].filter(signal => signal.signal === 'sell').length;

    if (buySignals > sellSignals) return 'up';
    if (sellSignals > buySignals) return 'down';
    return 'consolidating';
  }

  // Helper method to fetch the current price in priceData
  getCurrentPrice() {
    return this.priceData[this.priceData.length - 1];
  }

  // Make a prediction based on the signals and history asynchronously
  getPrediction = async () => {
    const priceTrend = this.analyzePriceData();
    const historyTrend = this.analyzeHistory();
    const signalTime = new Date().toISOString();
    const currentPrice = await this.getCurrentPrice(); // Assuming getCurrentPrice is a method that fetches the current price

    let prediction;
    if (priceTrend === 'up' && historyTrend === 'up') {
      prediction = 'Buy';
    } else if (priceTrend === 'down' && historyTrend === 'down') {
      prediction = 'Sell';
    } else {
      prediction = 'Hold';
    }

    const predictionData = {
      tradingPair: 'BTC/USD', // Example trading pair
      strategy: 'Combined', // Example strategy
      prediction,
      predictionTime: signalTime,
      status: 'Open', // Example status
      openPrice: currentPrice,
      currentPrice,
      closePrice: currentPrice, // Example close price
      change: '0%', // Example change
      profit: 0, // Example profit
      tradeTime: signalTime
    };

    // Save the prediction to the database
    //const savedPrediction = await PredictionModel.create(predictionData);
    return predictionData;
  }
}

module.exports = Prediction;