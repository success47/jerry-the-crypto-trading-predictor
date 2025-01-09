class PredictionHistory {
    predictions = [];

    constructor(parameters) {
        // Initialize with any parameters if needed
    }

    // Add predictions to the history
    addPredictions(newPredictions) {
        if (!Array.isArray(newPredictions)) {
            throw new TypeError('newPredictions must be an array');
        }
        this.removeLastPrediction(); // Remove last prediction when limit is reached
        this.predictions.push(...newPredictions);
    }

    // Get the history of predictions
    getPredictions = async () => {
        return this.predictions;
    }

    // Remove last prediction from the history when limit is reached
    removeLastPrediction() {
        if (this.predictions.length > 100) {
            this.predictions.shift();
        }
    }
}

module.exports = PredictionHistory;