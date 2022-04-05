'use strict';
const { sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async find(ctx) {
    const global = await strapi.services.global.find(ctx.query);
    const footer = await strapi.services['footer'].find(ctx.query);
    const menuStudents = await strapi.services['menu-students'].find(ctx.query);
    const menuApplicants = await strapi.services['menu-applicants'].find(ctx.query);
    const menuSchool = await strapi.services['menu-school'].find(ctx.query);
    const menuFestivals = await strapi.services['menu-festivals'].find(ctx.query);
    const result = {
      ...global,
      footer: sanitizeEntity(footer, { model: strapi.models['footer'] }),
      menu: [
        sanitizeEntity({
          ...menuApplicants,
          studies: menuApplicants && menuApplicants.studies.slice(0, 5).map((item) => item.field_of_study),
        },
        { model: strapi.models['menu-applicants'] }
      ),
        sanitizeEntity(menuStudents, { model: strapi.models['menu-students'] }),
        sanitizeEntity(menuSchool, { model: strapi.models['menu-school'] }),
        sanitizeEntity(menuFestivals, { model: strapi.models['menu-festivals'] }),
      ].filter((item) => item !== null)
    }
    return sanitizeEntity(result, { model: strapi.models.global });
  },
};
