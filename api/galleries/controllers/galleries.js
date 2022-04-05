'use strict';
const { sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

 const eventsComparator = (a, b) => {
  const dateA = (new Date(a.date)).getTime();
  const dateB = (new Date(b.date)).getTime();
  if (dateA === dateB) {
    return 0;
  }
  return dateA > dateB ? -1 : 1;
};

module.exports = {
  async find(ctx) {
    const galleries = await strapi.services.galleries.find(ctx.query);
    const events = await strapi.services['gallery-event'].find(ctx.query);

    const sanitzedGalleriesData = sanitizeEntity(galleries, { model: strapi.models['galleries'] });
    const sanitzedEventsData = sanitizeEntity(events, { model: strapi.models['gallery-event'] });

    return {
      ...sanitzedGalleriesData,
      galleries_uats: sanitzedGalleriesData.galleries_uats.map((item) => {
        let transformed = {
          ...item,
          image: item.image_424x488,
        }
        delete transformed.image_424x488;
        return transformed;
      }),
      events: sanitzedEventsData.map((item) => ({
        id: item.id,
        title: item.title,
        subtitle: item.subtitle,
        date: item.date,
        description: item.description.slice(0, 200),
        image: item.image,
      }))
      .sort(eventsComparator),
    };
  },
};
