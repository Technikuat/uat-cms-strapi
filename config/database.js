module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: {
        client: 'postgres',
        host: 'cms-postgresql',
        port: 5432,
        database: 'uat_cms',
        username: 'uat_user',
        password: '2408fbrwuceno2i4bfon393gyvwfbd23n',
        ssl: false
      },
      options: {
        useNullAsDefault: true,
        debug: false,
      },
    },
  },
});
