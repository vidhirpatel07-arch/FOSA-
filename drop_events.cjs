const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');
db.serialize(() => {
  db.run('DROP TABLE IF EXISTS events');
  console.log('Events table dropped.');
});
db.close();
