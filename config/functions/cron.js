'use strict';
const axios = require('axios')

/**
 * Cron config that gives you an opportunity
 * to run scheduled jobs.
 *
 * The cron format consists of:
 * [SECOND (optional)] [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK]
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#cron-tasks
 */

module.exports = ({ env }) => ({
  enabled: true,
  // every minute
  '* * * * *': async () => {
    const url = env("SCRAPPER_URL", 'http://localhost:8080/fb')

    try {
      const response = await axios.post(url)
      console.log(response.data)
    } catch (err) {
      console.log(err)
    }
  }
  /**
   * Simple example.
   * Every monday at 1am.
   */
  // '0 1 * * 1': () => {
  //
  // }
})

