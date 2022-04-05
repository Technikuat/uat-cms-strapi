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
    const { year } = ctx.query;
    delete ctx.query.year;
    
    const news = await strapi.services.new.find({ ...ctx.query, _limit: -1 });
    const newsMap = news.reduce((acc, item) => {
      const itemYear = item.date.split('-')[0];
      return {
        ...acc,
        [itemYear]: [...(acc[itemYear] || []), item],
      };
    }, {});
    
    const years = Object.keys(newsMap).sort((a, b) => b.localeCompare(a));
    let newsData = [];
    if (newsMap[year] === undefined) {
      newsData = years.length > 0 ? newsMap[years[0]] : [];
    } else {
      newsData = newsMap[year];
    }
    const sanitzedData = sanitizeEntity(newsData, { model: strapi.models.new });

    const result = await Promise.all(sanitzedData.map(async (item) => {
      const transformedLocalizations = await Promise.all(item.localizations.map(async (item) => {
        const singlePage = await strapi.services.new.findOne({ id: item.id});

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
          return sec;
        })
      }
      
      return transformed;
    }));
    return {
      news: result.sort(newsComparator),
      years: years,
    };
  },
};
