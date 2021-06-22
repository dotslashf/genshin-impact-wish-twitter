const { SparklingSteps } = require('../models/sparklingSteps');
const { WanderlustInvocation } = require('../models/wanderlustInvocation');
const { EpitomeInvocation } = require('../models/epitomeInvocation');

const getBanner = banner => {
  const limitedBanner = new SparklingSteps();
  const standardBanner = new WanderlustInvocation();
  const weaponBanner = new EpitomeInvocation();

  if (banner === 'limited') {
    return {
      id: 'sparklingSteps',
      banner: limitedBanner,
    };
  } else if (banner === 'standard') {
    return {
      id: 'wanderlustInvocation',
      banner: standardBanner,
    };
  } else if (banner === 'weapon') {
    return {
      id: 'epitomeInvocation',
      banner: weaponBanner,
    };
  }
};

module.exports = {
  getBanner,
};
