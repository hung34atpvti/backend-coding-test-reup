const sqlite3 = require('sqlite3').verbose();
const appConfig = require('./src/app');
const loggers = require('./src/loggers');

const port = 8010;
const db = new sqlite3.Database(':memory:');

const buildSchemas = require('./src/schemas');

db.serialize(() => {
  buildSchemas(db);
  const app = appConfig(db);
  app.listen(port, () =>
    loggers.info(`App started and listening on port ${port}`)
  );
});
