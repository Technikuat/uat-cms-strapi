'use strict';
const { sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const teachersComparator = (a, b) => {
  return a.id < b.id ? -1 : 1;
}

module.exports = {
  async find(ctx) {
    const teachers = await strapi.services.teacher.find({ ...ctx.query, _limit: -1 });
    const sanitzedData = sanitizeEntity(teachers, { model: strapi.models.teacher });

    const result = sanitzedData.map((item) => {
      let transformed = {
        ...item,
        photo: item.photo_340x609,
      }
      delete transformed.photo_340x609;
      return transformed;
    })
    .sort(teachersComparator);
    return result;
  },
};
