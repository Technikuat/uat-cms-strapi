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

module.exports = {
  // every day at 1 am
  '0 1 * * * *': async () => {
    const url = strapi?.config?.server?.cron?.scrapperUrl || process.env.SCRAPPER_URL || "http://scrapper:8080/fb"
    try {
      await axios.post(url)
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
}

