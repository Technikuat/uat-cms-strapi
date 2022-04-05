'use strict';
const { sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async findOne(ctx) {
    const study = await strapi.services['field-of-study'].findOne({...ctx.query, id: ctx.params.id});
    const sanitzedData = sanitizeEntity(study, { model: strapi.models['field-of-study'] });

    const galleriesResult = sanitzedData.galleries.map((item) => {
      let transformed = {
        ...item,
        gallery_item: item.gallery_item.map((galleryItem) => {
          const transformedItem = {
            ...galleryItem,
            thumbnail: galleryItem.thumbnail_410x551,
          }
          delete transformedItem.thumbnail_410x551;
          return transformedItem;
        })
      }
      
      return transformed;
    });
    const teachersResult = sanitzedData.teachers.map((item) => {
      let transformed = {
        ...item.teacher,
        photo: item.teacher.photo_340x609,
      }
      delete transformed.photo_340x609;
      return transformed;
    });
    return {
      ...sanitzedData,
      galleries: galleriesResult,
      teachers: teachersResult,
    }
  },
  async find(ctx) {
    return null
  }
};
