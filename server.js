import express from 'express';
import cors from 'cors';
import multer from 'multer';
import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Simple hardcoded admin credentials and token
const ADMIN_EMAIL = 'forceoneDefenceacademy@gmail.com';
const ADMIN_PASS = 'FOSA@admin01';
const ADMIN_TOKEN = 'fosa-super-secret-admin-token-2026';

// Middleware to protect admin routes
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader === `Bearer ${ADMIN_TOKEN}`) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized. Invalid or missing token.' });
  }
};

// Setup uploads folder
const dataDir = process.env.DATA_DIR || __dirname;
const uploadDir = path.join(dataDir, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve uploaded files statically
app.use('/uploads', express.static(uploadDir));

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Database setup
const dbPath = path.join(dataDir, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error("Database opening error: ", err);
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    eventId TEXT,
    name TEXT,
    time TEXT,
    capacity INTEGER,
    booked INTEGER,
    price INTEGER,
    discountPrice INTEGER
  )`);
  
  db.run(`CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    date TEXT,
    hero_image TEXT,
    tags TEXT,
    timeline TEXT,
    faqs TEXT,
    gallery TEXT,
    price TEXT,
    discount_price TEXT,
    session_text TEXT,
    location_text TEXT,
    location_link TEXT
  )`);
  
  db.run(`CREATE TABLE IF NOT EXISTS site_config (
    key TEXT PRIMARY KEY,
    value TEXT
  )`);
  
  db.run(`CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    sessionId TEXT,
    participants INTEGER,
    details TEXT,
    receiptUrl TEXT,
    status TEXT,
    userId TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  
  db.run(`CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT,
    message TEXT,
    isRead INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Seed initial events, config, and sessions if empty
  db.get(`SELECT COUNT(*) as count FROM events`, (err, row) => {
    if (row && row.count === 0) {
      const eventStmt = db.prepare(`INSERT INTO events VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
      eventStmt.run(
        'evt_1', 
        'Pilates Ã— Equestrian Experience',
        'A curated experience bringing together mindful Pilates, outdoor adventure, equestrian connection and unforgettable moments.',
        '12 Sep 2026',
        '/images/pilates_2.jpg',
        JSON.stringify(['Beginner Friendly', 'Limited Spots']),
        JSON.stringify([
          {time: '01 Welcome', desc: 'Refreshments upon your arrival.'},
          {time: '02 Pilates', desc: '30-minute beginner-friendly session.'},
          {time: '03 Rifle Shooting', desc: 'Guided, supervised activity.'},
          {time: '04 Meet the Horses', desc: 'Introduction & interaction.'},
          {time: '05 Ride & Feed', desc: 'Guided riding and feeding.'},
          {time: '06 Closing', desc: 'Refreshments and connection.'}
        ]),
        JSON.stringify([
          {q: 'How much does it cost?', a: '₹1,500 per person.'},
          {q: 'Is there a refund?', a: 'No. All confirmed bookings are non-refundable.'}
        ]),
        JSON.stringify([
          '/images/pilates_1.jpg',
          '/images/pilates_3.jpg',
          '/images/pilates_4.jpg',
          '/images/venue_setting_1787392316077.jpg'
        ]),
        '1500',
        '',
        '7AM & 5:30PM',
        'Force One Defence Academy',
        'https://forceoneacademy.in'
      );
      eventStmt.finalize();
    }
  });

  db.get(`SELECT COUNT(*) as count FROM site_config`, (err, row) => {
    if (row && row.count === 0) {
      const configStmt = db.prepare(`INSERT INTO site_config VALUES (?, ?)`);
      configStmt.run('hero_images', JSON.stringify([
        '/images/pilates_session_1787392269816.jpg',
        '/images/horse_interaction_1787392285722.jpg',
        '/images/venue_setting_1787392316077.jpg'
      ]));
      configStmt.finalize();
    }
  });

  db.get(`SELECT COUNT(*) as count FROM sessions`, (err, row) => {
    if (row && row.count === 0) {
      const stmt = db.prepare(`INSERT INTO sessions VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
      // id, eventId, name, time, capacity, booked, price, discountPrice
      stmt.run('morning', 'evt_1', 'Morning Experience', '7:00 AM', 20, 0, 1500, null);
      stmt.run('evening', 'evt_1', 'Evening Experience', '5:30 PM', 20, 0, 2000, null);
      stmt.finalize();
    }
  });
});

// API Routes

// Admin Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
    res.json({ success: true, token: ADMIN_TOKEN });
  } else {
    res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
});

app.get('/api/admin/stats', requireAuth, (req, res) => {
  const stats = {};
  db.get(`SELECT COUNT(*) as eventsCount FROM events`, [], (err, row) => {
    stats.eventsCount = row ? row.eventsCount : 0;
    db.get(`SELECT COUNT(*) as bookingsCount FROM bookings`, [], (err, row) => {
      stats.bookingsCount = row ? row.bookingsCount : 0;
      res.json(stats);
    });
  });
});

app.get('/api/admin/backup', requireAuth, (req, res) => {
  const dbPath = path.join(dataDir, 'database.sqlite');
  res.download(dbPath, `fosa_backup_${new Date().toISOString().split('T')[0]}.sqlite`);
});

app.get('/api/admin/export-bookings', requireAuth, (req, res) => {
  db.all(`
    SELECT b.id, s.name as sessionName, b.status, b.details, b.createdAt
    FROM bookings b
    LEFT JOIN sessions s ON b.sessionId = s.id
    ORDER BY b.createdAt DESC
  `, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    
    let csv = "Booking ID,Session,Status,Date,Participant Name,Age,Email,Phone,Pilates Level,Horse Level,Medical Info,Emergency Name,Emergency Phone\n";
    rows.forEach(r => {
      try {
        const arr = JSON.parse(r.details || '[]');
        arr.forEach(p => {
          csv += `"${r.id}","${r.sessionName || ''}","${r.status}","${r.createdAt}","${p.name || ''}","${p.age || ''}","${p.email || ''}","${p.phone || ''}","${p.pilates || ''}","${p.horse || ''}","${p.medical || ''}","${p.emName || ''}","${p.emPhone || ''}"\n`;
        });
      } catch(e) {}
    });

    res.header('Content-Type', 'text/csv');
    res.attachment(`FOSA_Bookings_${new Date().toISOString().split('T')[0]}.csv`);
    return res.send(csv);
  });
});

// Admin config routes
app.get('/api/admin/config', requireAuth, (req, res) => {
  db.all(`SELECT * FROM site_config`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const config = {};
    rows.forEach(r => config[r.key] = JSON.parse(r.value));
    res.json(config);
  });
});

app.post('/api/admin/config', requireAuth, (req, res) => {
  const { key, value } = req.body;
  db.run(`INSERT INTO site_config (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value`, [key, JSON.stringify(value)], (err) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true });
  });
});

// Generic Data fetching
app.get('/api/config', (req, res) => {
  db.all(`SELECT * FROM site_config`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const config = {};
    rows.forEach(r => config[r.key] = JSON.parse(r.value));
    res.json(config);
  });
});

app.get('/api/events', (req, res) => {
  db.all(`SELECT * FROM events`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const parsed = rows.map(r => ({
      ...r,
      tags: JSON.parse(r.tags),
      timeline: JSON.parse(r.timeline),
      faqs: JSON.parse(r.faqs),
      gallery: r.gallery ? JSON.parse(r.gallery) : []
    }));
    res.json(parsed);
  });
});

app.post('/api/admin/events', requireAuth, (req, res) => {
  const { id, title, description, date, hero_image, tags, timeline, faqs, gallery, price, discount_price, session_text, location_text, location_link } = req.body;
  const eventId = id || 'evt_' + Math.random().toString(36).substr(2, 9);
  
  db.get(`SELECT id FROM events WHERE id = ?`, [eventId], (err, row) => {
    if (row) {
      // Update
      const stmt = db.prepare(`UPDATE events SET title=?, description=?, date=?, hero_image=?, tags=?, timeline=?, faqs=?, gallery=?, price=?, discount_price=?, session_text=?, location_text=?, location_link=? WHERE id=?`);
      stmt.run(title, description, date, hero_image, JSON.stringify(tags), JSON.stringify(timeline), JSON.stringify(faqs), JSON.stringify(gallery), price, discount_price, session_text, location_text, location_link, eventId, function(err) {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true, id: eventId });
      });
      stmt.finalize();
    } else {
      // Insert
      const stmt = db.prepare(`INSERT INTO events VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
      stmt.run(eventId, title, description, date, hero_image, JSON.stringify(tags), JSON.stringify(timeline), JSON.stringify(faqs), JSON.stringify(gallery), price, discount_price, session_text, location_text, location_link, function(err) {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true, id: eventId });
      });
      stmt.finalize();
    }
  });
});

app.delete('/api/admin/events/:id', requireAuth, (req, res) => {
  db.run(`DELETE FROM events WHERE id = ?`, [req.params.id], function(err) {
    if (err) return res.status(500).json({ success: false, error: err.message });
    
    // Delete attached sessions
    db.run(`DELETE FROM sessions WHERE eventId = ?`, [req.params.id], (err) => {
      res.json({ success: true });
    });
  });
});

app.get('/api/sessions', (req, res) => {
  const { eventId } = req.query;
  if (eventId) {
    db.all(`SELECT * FROM sessions WHERE eventId = ?`, [eventId], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  } else {
    db.all(`SELECT * FROM sessions`, [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  }
});

app.post('/api/admin/sessions', requireAuth, (req, res) => {
  const { eventId, name, time, capacity, price } = req.body;
  const sessionId = 'sess_' + Math.random().toString(36).substr(2, 9);
  
  const stmt = db.prepare(`INSERT INTO sessions (id, eventId, name, time, capacity, booked, price) VALUES (?, ?, ?, ?, ?, ?, ?)`);
  stmt.run(sessionId, eventId, name, time, capacity, 0, price, function(err) {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, id: sessionId });
  });
  stmt.finalize();
});

app.delete('/api/admin/sessions/:id', requireAuth, (req, res) => {
  db.run(`DELETE FROM sessions WHERE id = ?`, [req.params.id], function(err) {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true });
  });
});

app.post('/api/book', upload.single('receipt'), (req, res) => {
  const { sessionId, participants, details, userId } = req.body;
  const parsedDetails = JSON.parse(details);
  const receiptUrl = req.file ? '/uploads/' + req.file.filename : null;
  const bookingId = 'BKG-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  
  db.serialize(() => {
    // Check capacity
    db.get(`SELECT capacity, booked FROM sessions WHERE id = ?`, [sessionId], (err, session) => {
      if (err) return res.status(500).json({ error: err.message });
      if (session.booked + parseInt(participants) > session.capacity) {
        return res.status(400).json({ error: 'Not enough spots available.' });
      }
      
      // Insert booking
      const stmt = db.prepare(`INSERT INTO bookings VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
      stmt.run(bookingId, sessionId, participants, JSON.stringify(parsedDetails), receiptUrl, 'Pending Approval', userId, new Date().toISOString(), function(err) {
        if (err) return res.status(500).json({ error: err.message });
        
        // Notify user of successful submission
        const msg = `Your payment and booking request (${bookingId}) has been received and is currently pending approval. We will notify you once confirmed.`;
        db.run(`INSERT INTO notifications (userId, message) VALUES (?, ?)`, [userId, msg], (err) => {
          res.json({ success: true, bookingId });
        });
      });
      stmt.finalize();
    });
  });
});

// Get public ticket by booking id
app.get('/api/ticket/:id', (req, res) => {
  db.get(`SELECT * FROM bookings WHERE id = ?`, [req.params.id], (err, booking) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!booking) return res.status(404).json({ error: 'Ticket not found' });
    
    db.get(`SELECT * FROM sessions WHERE id = ?`, [booking.sessionId], (err, session) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!session) return res.json({ booking: {...booking, details: JSON.parse(booking.details)}, session: null, event: null });
      
      db.get(`SELECT * FROM events WHERE id = ?`, [session.eventId], (err, event) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({
          booking: { ...booking, details: JSON.parse(booking.details) },
          session: session,
          event: event
        });
      });
    });
  });
});

// Admin get all bookings
app.get('/api/admin/bookings', requireAuth, (req, res) => {
  db.all(`SELECT * FROM bookings ORDER BY createdAt DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    // Parse JSON details
    const parsed = rows.map(r => ({
      ...r,
      details: JSON.parse(r.details)
    }));
    res.json(parsed);
  });
});

// Admin delete a booking
app.delete('/api/admin/bookings/:id', requireAuth, (req, res) => {
  db.run(`DELETE FROM bookings WHERE id = ?`, [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Admin update capacity
app.post('/api/admin/capacity', requireAuth, (req, res) => {
  const { sessionId, capacity } = req.body;
  db.run(`UPDATE sessions SET capacity = ? WHERE id = ?`, [capacity, sessionId], function(err) {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true });
  });
});

// Admin approve booking
app.post('/api/admin/approve', requireAuth, (req, res) => {
  const { bookingId } = req.body;
  db.get(`SELECT * FROM bookings WHERE id = ?`, [bookingId], (err, booking) => {
    if (err || !booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.status === 'Confirmed') return res.status(400).json({ error: 'Already confirmed' });

    db.serialize(() => {
        // Update session count
        db.run(`UPDATE sessions SET booked = booked + ? WHERE id = ?`, [booking.participants, booking.sessionId], (err) => {
          if (err) return res.status(500).json({ success: false, error: err.message });
          
          // Update booking status
          db.run(`UPDATE bookings SET status = 'Confirmed' WHERE id = ?`, [bookingId]);

          // Insert notification with receipt link
          const msg = `Your booking (${bookingId}) has been approved! <br><a href="/receipt.html?id=${bookingId}" class="btn btn-outline" style="display:inline-block; margin-top:10px; padding: 0.3rem 0.8rem; text-decoration:none;">View Digital Ticket</a>`;
          db.run(`INSERT INTO notifications (userId, message) VALUES (?, ?)`, [booking.userId, msg], (err) => {
            res.json({ success: true });
          });
        });
    });
  });
});

// User get notifications
app.get('/api/notifications/:userId', (req, res) => {
  db.all(`SELECT * FROM notifications WHERE userId = ? ORDER BY createdAt DESC`, [req.params.userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/notifications/read', (req, res) => {
  const { ids } = req.body; // array of notification ids
  if (!ids || ids.length === 0) return res.json({success: true});
  const placeholders = ids.map(() => '?').join(',');
  db.run(`UPDATE notifications SET isRead = 1 WHERE id IN (${placeholders})`, ids, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

const PORT = process.env.PORT || 3000;

// Serve static frontend files from 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback for SPA routing
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('Backend API running on port ' + PORT);
});

