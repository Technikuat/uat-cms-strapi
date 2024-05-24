module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 80),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', '80b864174b437434b6ff6b1696c92129'),
    },
  },
  cron: {
    enabled: true,
    scrapperUrl: env("SCRAPPER_URL", 'http://localhost:8080/fb')
  }
});
