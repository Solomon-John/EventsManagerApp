const config = {
  development: {
    username: 'postgres',
    password: 'postgres',
    database: 'eventManager-dev',
    host: '127.0.0.1',
    dialect: 'postgres'
  },
  test: {
    username: 'postgres',
    password: 'postgres',
    database: 'eventManager-dev-test',
    host: '127.0.0.1',
    dialect: 'postgres'
  },
  production: {
    dialect: 'postgres'
  }
};

export default config;
