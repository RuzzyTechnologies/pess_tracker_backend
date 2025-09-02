require("reflect-metadata");
const { DataSource } = require("typeorm");
const User = require("./models/user");


const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: true, // change when in prod mode;
  logging: false,
  entities: ["src/models/**/*.js"],
  migrations: ['src/migrations/**/*.js'],
  migrationsTableName: "migrations"

});

async function initializeDataSource() {
  if (!AppDataSource.isInitialized) {
    return await AppDataSource.initialize();
  }
  return AppDataSource;
}


module.exports = initializeDataSource();