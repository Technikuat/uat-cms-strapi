'use strict';
const { sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async findOne(ctx) {
    const event = await strapi.services['gallery-event'].findOne({...ctx.query, id: ctx.params.id});
    const sanitzedData = sanitizeEntity(event, { model: strapi.models['gallery-event'] });

    return {
      ...sanitzedData,
      gallery: {
        ...sanitzedData.gallery,
        gallery_item: sanitzedData.gallery.gallery_item.map((galleryItem) => {
          const transformedItem = {
            ...galleryItem,
            thumbnail: galleryItem.thumbnail_410x551,
          }
          delete transformedItem.thumbnail_410x551;
          return transformedItem;
        })
      }
    }
  },
};
