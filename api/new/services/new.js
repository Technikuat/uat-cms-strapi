'use strict';
const { createCoreService } = require('strapi')

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
    checkFacebookID: async (id) => {
        return strapi.query('new').model.query(qb => qb.where('facebook_id', id)).fetch()
    }
}
