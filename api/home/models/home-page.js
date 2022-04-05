'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

//  const asyncRes = await Promise.all(arr.map(async (i) => {
// 	await sleep(10);
// 	return i + 1;
// }));


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

const updateFieldOfStudyEntry = async (fos) => await updateEntry(fos, 'field-of-study', 'field_of_study', 'name');

const updateFestivalEntry = async (fos) => await updateEntry(fos, 'festival', 'festival', 'title');

const updateGalleryEntry = async (fos) => await updateEntry(fos, 'galleries-uat', 'galleries_uat', 'name')

module.exports = {
  lifecycles: {
    async beforeCreate(data) {
      if (data.fields_of_studies) {
        data.fields_of_studies = await updateFieldOfStudyEntry(data.fields_of_studies);
      }
      if (data.festivals) {
        data.festivals = await updateFestivalEntry(data.festivals);
      }
      if (data.galleries) {
        data.galleries = await updateGalleryEntry(data.galleries);
      }
    },
    async beforeUpdate(params, data) {
      if (data.fields_of_studies) {
        data.fields_of_studies = await updateFieldOfStudyEntry(data.fields_of_studies);
      }
      if (data.festivals) {
        data.festivals = await updateFestivalEntry(data.festivals);
      }
      if (data.galleries) {
        data.galleries = await updateGalleryEntry(data.galleries);
      }
    },
  },
};
