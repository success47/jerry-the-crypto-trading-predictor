module.exports = (sequelize, DataTypes) => {
    const Prediction = sequelize.define('Prediction', {
      prediction: DataTypes.STRING,
      timestamp: DataTypes.DATE
    });
    return Prediction;
  };