class Prediction {
    constructor(history, priceData) {
      this.history = history;
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
      const smaSignals = this.history.filter(signal => signal.strategy === 'SMA');
      const emaSignals = this.history.filter(signal => signal.strategy === 'EMA');
      const rsiSignals = this.history.filter(signal => signal.strategy === 'RSI');

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
    
      if (priceTrend === 'up' && historyTrend === 'up') {
        return { prediction: 'Buy', signalTime, currentPrice };
      } else if (priceTrend === 'down' && historyTrend === 'down') {
        return { prediction: 'Sell', signalTime, currentPrice };
      } else {
        return { prediction: 'Hold', signalTime, currentPrice };
      }
    }
  }
  
  module.exports = Prediction;