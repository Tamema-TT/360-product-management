import { Knex } from 'knex';

interface KnexConfig extends Knex.Config {
  development: {
    client: string;
    connection: {
      host: string;
      user: string;
      password: string;
      database: string;
    };
    migrations: {
      directory: string;
    };
    seeds: {
      directory: string;
    };
  };
  production: {
    client: string;
    connection: string;
  };
}

const config: KnexConfig = {
  development: {
    client: 'mysql2',
    connection: {
      host: 'localhost',
      user: 'root',
      password: 'Your-database-password',
      database: 'product_management'
    },
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
  },
  production: {
    client: 'mysql2',
    connection: process.env.JAWSDB_URL!,
  }
};

export default config;
