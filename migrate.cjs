const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');

db.serialize(() => {
  // Add columns to sessions table, catch errors if they already exist
  try {
    db.run("ALTER TABLE sessions ADD COLUMN eventId TEXT", (err) => {
      if(err && !err.message.includes("duplicate column")) console.error(err);
      
      // Update existing sessions to point to evt_1
      db.run("UPDATE sessions SET eventId = 'evt_1' WHERE eventId IS NULL");
    });
  } catch (e) {}

  try {
    db.run("ALTER TABLE sessions ADD COLUMN discountPrice INTEGER", (err) => {
      if(err && !err.message.includes("duplicate column")) console.error(err);
    });
  } catch (e) {}
  
  db.all("PRAGMA table_info(sessions)", (err, rows) => {
    console.log("Updated sessions schema:");
    console.log(rows);
  });
});

db.close();
