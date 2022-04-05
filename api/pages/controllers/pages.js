'use strict';
const { sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async find(ctx) {
    const pages = await strapi.services.pages.find(ctx.query);

    const sanitzedData = sanitizeEntity(pages, { model: strapi.models.pages });

    const result = await Promise.all(sanitzedData.map( async (item) => {
      const transformedLocalizations = await Promise.all(item.localizations.map(async (item) => {
        const singlePage = await strapi.services.pages.findOne({ id: item.id});

        return {
          ...item,
          slug: singlePage.slug,
        }
      }));
      
      let transformed = {
        ...item,
        localizations: transformedLocalizations,
        sections: item.sections.map((sec) => {
          if (sec.__component === 'shared.gallery') {
            return {
              ...sec,
              gallery_item: sec.gallery_item.map((galleryItem) => {
                const transformedItem = {
                  ...galleryItem,
                  thumbnail: galleryItem.thumbnail_410x551,
                }
                delete transformedItem.thumbnail_410x551;
                return transformedItem;
              })
            }
          }
          if (sec.__component === 'shared.teachers-slice') {
            return {
              ...sec,
              teachers: sec.teachers.map((item) => {
                let transformed = {
                  ...item.teacher,
                  photo: item.teacher.photo_340x609,
                }
                delete transformed.photo_340x609;
                return transformed;
              })
            }
          }
          return sec;
        })
      }
      
      return transformed;
    }));
    console.log({ result })
    return result;
  },
};
