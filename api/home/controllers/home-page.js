'use strict';
const { sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const newsComparator = (a, b) => {
  const dateA = (new Date(a.date)).getTime();
  const dateB = (new Date(b.date)).getTime();
  if (dateA === dateB) {
    return 0;
  }
  return dateA > dateB ? -1 : 1;
};

module.exports = {
  async find(ctx) {
    const home = await strapi.services['home-page'].find(ctx.query);
    const news = await strapi.services['new'].find(ctx.query);
    const galleries = await strapi.services.galleries.find(ctx.query);
    const galleryEvents = await strapi.services['gallery-event'].find(ctx.query);
    const footer = await strapi.services['footer'].find(ctx.query);
    const sanitizedGalleries = sanitizeEntity((galleries || {}), { model: strapi.models['galleries'] });
    const transformedUATGalleries = home.galleries.map((item => {
      let transformed = {
        ...item.galleries_uat,
        image: item.galleries_uat.image_424x488,
      }
      delete transformed.image_424x488;
      return transformed;
    }));

    const footerData = sanitizeEntity(footer, { model: strapi.models['footer'] });
    const result = {
      ...sanitizeEntity(home, { model: strapi.models['home-page'] }),
      news: sanitizeEntity((news || [])
        .filter((item) => !item.important_news)
        .sort(newsComparator)
        .slice(0, 12), { model: strapi.models['new'] }),
      importantNews: sanitizeEntity((news || [])
        .filter((item) => item.important_news)
        .sort(newsComparator)
        .slice(0, 3), { model: strapi.models['new'] }),
      festivals: sanitizeEntity(
        (home.festivals || [])
          .map((item) => item.festival)
          .slice(0, 5),
        { model: strapi.models['festival'] }
      ),
      fields_of_studies: sanitizeEntity(
        (home.fields_of_studies || [])
          .map((item) => item.field_of_study)
          .slice(0, 5),
        { model: strapi.models['field-of-study'] }
      ),
      galleries: {
        ...sanitizedGalleries,
        galleries_uats: transformedUATGalleries,
      },
      galleryEvents: sanitizeEntity((galleryEvents || []).slice(0, 3), { model: strapi.models['gallery-event'] }),
      social: {
        facebook: footerData ? footerData.facebook : null,
        instagram: footerData ? footerData.instagram : null,
        youtube: footerData ? footerData.youtube : null,
      },
    }
    return result;
  }
};
