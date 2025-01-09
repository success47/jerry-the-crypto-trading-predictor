class SignalHistory {
    signals = [];

    constructor(parameters) {
        // Initialize with any parameters if needed
    }

    // Add signals to the history
    addSignals(newSignals) {
        this.removeLastSignal();// Remove last signal when limit is reached
        this.signals.push(...newSignals);
    }

    // Get the history of signals
    getSignals = async () => {
        return this.signals;
    }

    // Remove last signal from the history when limit is reached
    removeLastSignal() {
        if (this.signals.length > 100) {
            this.signals.shift();
        }
    }
}

module.exports = SignalHistory;