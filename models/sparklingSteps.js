const { BaseGacha } = require('./baseGacha');
const drops = require('../data/sparkling-steps-2.json');

class SparklingSteps extends BaseGacha {
  constructor() {
    super(drops);
    this.name = 'Sparkling Steps';
    this.src = 'banners/sparkling-steps-2.png';
  }
}

module.exports = {
  SparklingSteps,
};
