'use strict';
const { sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async find(ctx) {
    const aboutSchool = await strapi.services['about-school'].find(ctx.query);

    const sanitzedData = sanitizeEntity(aboutSchool, { model: strapi.models['about-school'] });
    return sanitzedData;
  },
};
