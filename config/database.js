module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: {
        client: env('DATABASE_CLIENT', 'postgres'),
        host: env('DATABASE_HOST', '0.0.0.0'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME', 'uat_cms'),
        username: env('DATABASE_USERNAME', 'uat_user'),
        password: env('DATABASE_PASSWORD', '2408fbrwuceno2i4bfon393gyvwfbd23n'),
        ssl: false
      },
      options: {
        useNullAsDefault: true,
        debug: false,
      },
    },
  },
});
