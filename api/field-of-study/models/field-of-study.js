'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */
 const updateEntry = async (collection, service, idName) => {
  const result = await Promise.all(collection.map(async (item) => {
    const itemData = await strapi.services[service].find({ id: item[idName] });
    return {
      ...item,
      title: itemData.length > 0 ? `${itemData[0].firstname} ${itemData[0].surname}` : 'NO_DATA',
    };
  }));
  return result;
}

const updateTeacherEntry = async (teachers) => await updateEntry(teachers, 'teacher', 'teacher');

module.exports = {
  lifecycles: {
    async beforeCreate(data) {
      if (data.fields_of_studies) {
        // data.fields_of_studies = await updateFieldOfStudyEntry(data.fields_of_studies);
      }
    },
    async beforeUpdate(params, data) {
      if (data.teachers) {
        data.teachers = await updateTeacherEntry(data.teachers);
      }
    },
  },
};
