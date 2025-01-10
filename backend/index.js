const express = require('express');
const cors = require('cors');
const { calculateIndicator, checkForSignals } = require('./indicators');
const config = require('./config');
const {fetchClosingPriceData, fetchTradingPairInfo } = require('./dataFetcher');
const SignalHistory = require('./signalHistory');
const signalHistory = new SignalHistory();
const Prediction = require('./prediction');
const PredictionHistory = require('./predictionHistory');
const predictionHistory = new PredictionHistory();


const app = express();
const port = 3001;

app.use(cors()); // Enable CORS

const runStrategies = async () => {
  const data = await fetchClosingPriceData();
  if (data.length === 0) return { signals: [], lastChecked: null};

  const lastChecked = new Date().toLocaleString('en-GB', {
    second: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const strategies = ['SMA', 'EMA', 'RSI'];
  const results = strategies.map(strategy => {
    let signals;

    if (strategy === 'SMC') {
      //smc removed for now
    } else {
      const shortIndicator = calculateIndicator(data, config.shortPeriod, strategy);
      const longIndicator = strategy === 'RSI' ? [] : calculateIndicator(data, config.longPeriod, strategy);
      signals = checkForSignals(data, shortIndicator, longIndicator, strategy);
    }

    return {
      strategy,
      signal: signals.buy ? 'buy' : signals.sell ? 'sell' : 'none',
        date: lastChecked
    };
  });

    console.log('Signals:', results);
    signalHistory.addSignals(results);


  return { signals: results, lastChecked};
};

app.get('/api/signals', async (req, res) => {
  const { signals, lastChecked } = await runStrategies();
  res.json({ signals, lastChecked});
});

// Endpoint to get the history of signals
app.get('/api/history', async (req, res) => {
    res.json(await signalHistory.getSignals());
});

// Endpoint to get prediction
app.get('/api/prediction', async (req, res) => {
    data = await fetchClosingPriceData();
    runStrategies();
    let prediction = new Prediction(signalHistory.signals, data);
    predictionResult = await prediction.getPrediction();
    if (predictionResult) {
        predictionHistory.addPredictions([predictionResult]);
    }
    res.json(predictionResult);
});

// Endpoint to get prediction history
app.get('/api/prediction-history', async (req, res) => {
  try {
    const predictions = await predictionHistory.getPredictions();
    res.json(predictions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch prediction history' });
  }
});

// Endpoint to get the trading pair information
app.get('/api/trading-info', async (req, res) => {
  try {
    const tradingInfo = await fetchTradingPairInfo();
    res.json(tradingInfo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trading info' });
  }
});

// Endpoint to get the current price
app.get('/api/symbol-price', async (req, res) => {
  try {
    console.log('Fetching closing price data...');
    const data = await fetchClosingPriceData();
    console.log('Data fetched:', data);
    
    if (data.length === 0) {
      console.log('No price data available');
      return res.status(404).json({ error: 'No price data available' });
    }
    
    const latestPrice = data[data.length - 1];
    console.log('Latest price:', latestPrice);
    res.json({ price: latestPrice });
    
  } catch (error) {
    console.error('Error fetching symbol price:', error);
    res.status(500).json({ error: 'Failed to fetch symbol price' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});