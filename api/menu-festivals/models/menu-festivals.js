'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

 const updateEntry = async (collection, service, idName, titleFieldName) => {
  const result = await Promise.all(collection.map(async (item) => {
    const itemData = await strapi.services[service].find({ id: item[idName] });
    return {
      ...item,
      title: itemData.length > 0 ? itemData[0][titleFieldName] : 'NO_DATA',
    };
  }));
  return result;
}

const updateFestivalEntry = async (fos) => await updateEntry(fos, 'festival', 'festival', 'title');

module.exports = {
  lifecycles: {
    async beforeCreate(data) {
      if (data.festivals) {
        data.festivals = await updateFestivalEntry(data.festivals);
      }
    },
    async beforeUpdate(params, data) {
      if (data.festivals) {
        data.festivals = await updateFestivalEntry(data.festivals);
      }
    },
  },
};
