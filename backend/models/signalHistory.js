module.exports = (sequelize, DataTypes) => {
    const SignalHistory = sequelize.define('SignalHistory', {
      signal: DataTypes.STRING,
      timestamp: DataTypes.DATE
    });
    return SignalHistory;
};