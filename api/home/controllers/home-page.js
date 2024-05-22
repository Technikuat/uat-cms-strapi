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

const parseLimits = (query) => {
  const inl = Number(query.inl)
  const nl = Number(query.nl)

  return {
    newsLimit: !Number.isNaN(nl) ? nl : undefined,
    importantNewsLimit: !Number.isNaN(inl) ? inl : undefined,
  }
}

const parseQuery = (query) => {
  if (query.inl !== undefined) {
    delete query.inl
  }

  if (query.nl) {
    delete query.nl
  }

  return query
}
module.exports = {
  async find(ctx) {
    const { newsLimit = 12, importantNewsLimit = 6 } = parseLimits(ctx.query)
    const { _locale = 'sk' } = parseQuery(ctx.query)

    const home = await strapi.services['home-page'].find({ _locale });
    const news = await strapi.services['new'].find({ _locale, _limit: newsLimit, _sort: "date:DESC" });
    const importantNews = await strapi.services['new']
      .find({ _locale, _limit: importantNewsLimit, important_news: true });

    const galleries = await strapi.services.galleries.find({ _locale });
    const galleryEvents = await strapi.services['gallery-event'].find({ _locale });
    const footer = await strapi.services['footer'].find({ _locale });

    const sanitizedGalleries = sanitizeEntity((galleries || {}), { model: strapi.models['galleries'] });
    const transformedUATGalleries = home.galleries.map((item => {
      if (item.galleries_uat?.image_424x488) {
        let transformed = {
          ...item.galleries_uat,
          image: item.galleries_uat.image_424x488,
        }
        delete transformed.image_424x488;
        return transformed;
      }

      return item.galleries_uat
    }));

    const footerData = sanitizeEntity(footer, { model: strapi.models['footer'] });
    const result = {
      ...sanitizeEntity(home, { model: strapi.models['home-page'] }),
      news: sanitizeEntity((news || [])
        // .filter((item) => !item.important_news)
        .sort(newsComparator), { model: strapi.models['new'] }),
      importantNews: sanitizeEntity((importantNews || [])
        .sort(newsComparator), { model: strapi.models['new'] }),
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
