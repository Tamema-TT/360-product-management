"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    development: {
        client: 'mysql2',
        connection: {
            host: 'localhost',
            user: 'root',
            password: 'abcd@1234',
            database: 'your_database_name'
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
        connection: process.env.JAWSDB_URL,
    }
};
exports.default = config;
//# sourceMappingURL=knexfile.js.map