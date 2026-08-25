import express from 'express';
import cors from 'cors';
import multer from 'multer';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Simple hardcoded admin credentials and token
const ADMIN_EMAIL = 'forceonesportsacademy@gmail.com';
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
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fosa';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Mongoose Schemas & Models
const sessionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  eventId: { type: String, required: true },
  name: { type: String },
  time: { type: String },
  capacity: { type: Number, default: 0 },
  booked: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  discountPrice: { type: Number }
});
const Session = mongoose.model('Session', sessionSchema);

const eventSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String },
  description: { type: String },
  date: { type: String },
  hero_image: { type: String },
  tags: { type: String },
  timeline: { type: String },
  faqs: { type: String },
  gallery: { type: String },
  price: { type: String },
  discount_price: { type: String },
  session_text: { type: String },
  location_text: { type: String },
  location_link: { type: String }
});
const Event = mongoose.model('Event', eventSchema);

const siteConfigSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: String }
});
const SiteConfig = mongoose.model('SiteConfig', siteConfigSchema);

const bookingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  sessionId: { type: String },
  participants: { type: Number, default: 1 },
  details: { type: String },
  receiptUrl: { type: String },
  status: { type: String, default: 'Pending Approval' },
  userId: { type: String },
  createdAt: { type: Date, default: Date.now }
});
const Booking = mongoose.model('Booking', bookingSchema);

const notificationSchema = new mongoose.Schema({
  userId: { type: String },
  message: { type: String },
  isRead: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
const Notification = mongoose.model('Notification', notificationSchema);

// Seed initial events, config, and sessions if empty
const seedDatabase = async () => {
  try {
    const eventsCount = await Event.countDocuments();
    if (eventsCount === 0) {
      await Event.create({
        id: 'evt_1', 
        title: 'Pilates × Horses',
        description: 'Pilates & Horses\nA curated morning, away from everything else.\nA curated experience bringing together mindful pilates, rifle shooting, horse introduction, horse riding, and horse feeding — designed as a complete reset, not just a workout.\nThree hours. No phones, no noise. Just movement, focus, and genuine connection with horses that don\'t care about your inbox.',
        date: '13 Sep 2026',
        hero_image: '/images/pilates_2.jpg',
        tags: JSON.stringify(['Limited Spots', 'Early Birds']),
        timeline: JSON.stringify([
          {time: '01 Welcome', desc: 'Refreshments upon your arrival.'},
          {time: '02 Pilates', desc: '30-minute beginner-friendly session.'},
          {time: '03 Rifle Shooting', desc: 'Guided, supervised activity.'},
          {time: '04 Meet the Horses', desc: 'Introduction & interaction.'},
          {time: '05 Horse Riding', desc: 'A guided riding experience'},
          {time: '06 ', desc: 'Hands-on time, up close'},
          {time: '07 Refreshments', desc: 'Light refreshments included through the morning'}
        ]),
        faqs: JSON.stringify([
          {q: 'How much does it cost?', a: '₹1,500 per person.'},
          {q: 'Is there a refund?', a: 'No. All confirmed bookings are non-refundable.'},
          {q: 'What do I need to bring?', a: 'A yoga mat and a water bottle (or whatever you\'re comfortable using through the morning). Everything else is taken care of.'},
          {q: 'What should I wear?', a: 'Whatever you\'re most comfortable moving in — there\'s no dress code. Just make sure it\'s something you can stretch, sit, and walk around in easily.'},
          {q: 'Do I need any prior experience with pilates, riding, or shooting?', a: 'No prior experience is needed for any part of the morning. Each session is guided from the basics.'},
          {q: 'Is this suitable for beginners?', a: 'Yes — this is designed for all levels, whether you\'re new to pilates, horses, or shooting, or already familiar with one or more.'},
          {q: 'How many people are in each session?', a: 'Sessions are kept intentionally small, so bookings are limited.'},
          {q: 'What if I have a medical condition or injury?', a: 'Please let us know at the time of booking so we can guide you on which activities are suitable for you.'}
        ]),
        gallery: JSON.stringify([
          '/images/pilates_1.jpg',
          '/images/pilates_3.jpg',
          '/images/pilates_4.jpg',
          '/images/venue_setting_1787392316077.jpg'
        ]),
        price: '1500',
        discount_price: '1200',
        session_text: '7:00AM & 5:30PM',
        location_text: 'Forceone Defence Academy',
        location_link: 'https://maps.app.goo.gl/yix57AmTEPcX35Y86'
      });
    }

    const configCount = await SiteConfig.countDocuments();
    if (configCount === 0) {
      await SiteConfig.create({
        key: 'hero_images',
        value: JSON.stringify([
          '/images/pilates_session_1787392269816.jpg',
          '/images/horse_interaction_1787392285722.jpg',
          '/images/venue_setting_1787392316077.jpg'
        ])
      });
    }

    const sessionsCount = await Session.countDocuments();
    if (sessionsCount === 0) {
      await Session.create([
        { id: 'morning', eventId: 'evt_1', name: 'Morning Experience', time: '7:00 AM', capacity: 20, booked: 0, price: 1500, discountPrice: 1200 },
        { id: 'evening', eventId: 'evt_1', name: 'Evening Experience', time: '5:30 PM', capacity: 20, booked: 0, price: 1500, discountPrice: 1200 }
      ]);
    }
  } catch (err) {
    console.error('Error seeding database:', err);
  }
};

mongoose.connection.once('open', () => {
  seedDatabase();
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

app.get('/api/admin/stats', requireAuth, async (req, res) => {
  try {
    const eventsCount = await Event.countDocuments();
    const bookingsCount = await Booking.countDocuments();
    res.json({ eventsCount, bookingsCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/backup', requireAuth, (req, res) => {
  res.status(501).json({ error: 'Database backup is now handled via MongoDB Atlas dashboard.' });
});

app.get('/api/admin/export-bookings', requireAuth, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 }).lean();
    const sessions = await Session.find().lean();
    const sessionMap = sessions.reduce((acc, s) => { acc[s.id] = s.name; return acc; }, {});

    let csv = "Booking ID,Session,Status,Date,Participant Name,Age,Email,Phone,Pilates Level,Horse Level,Medical Info,Emergency Name,Emergency Phone\n";
    bookings.forEach(r => {
      try {
        const arr = JSON.parse(r.details || '[]');
        const sessionName = sessionMap[r.sessionId] || '';
        arr.forEach(p => {
          csv += `"${r.id}","${sessionName}","${r.status}","${r.createdAt}","${p.name || ''}","${p.age || ''}","${p.email || ''}","${p.phone || ''}","${p.pilates || ''}","${p.horse || ''}","${p.medical || ''}","${p.emName || ''}","${p.emPhone || ''}"\n`;
        });
      } catch(e) {}
    });

    res.header('Content-Type', 'text/csv');
    res.attachment(`FOSA_Bookings_${new Date().toISOString().split('T')[0]}.csv`);
    return res.send(csv);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Admin config routes
app.get('/api/admin/config', requireAuth, async (req, res) => {
  try {
    const rows = await SiteConfig.find().lean();
    const config = {};
    rows.forEach(r => config[r.key] = JSON.parse(r.value));
    res.json(config);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/config', requireAuth, async (req, res) => {
  const { key, value } = req.body;
  try {
    await SiteConfig.findOneAndUpdate(
      { key },
      { value: JSON.stringify(value) },
      { upsert: true, new: true }
    );
    res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Generic Data fetching
app.get('/api/config', async (req, res) => {
  try {
    const rows = await SiteConfig.find().lean();
    const config = {};
    rows.forEach(r => config[r.key] = JSON.parse(r.value));
    res.json(config);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get('/api/events', async (req, res) => {
  try {
    const rows = await Event.find().lean();
    const parsed = rows.map(r => ({
      ...r,
      tags: JSON.parse(r.tags || '[]'),
      timeline: JSON.parse(r.timeline || '[]'),
      faqs: JSON.parse(r.faqs || '[]'),
      gallery: r.gallery ? JSON.parse(r.gallery) : []
    }));
    res.json(parsed);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/events', requireAuth, async (req, res) => {
  const { id, title, description, date, hero_image, tags, timeline, faqs, gallery, price, discount_price, session_text, location_text, location_link } = req.body;
  const eventId = id || 'evt_' + Math.random().toString(36).substr(2, 9);
  
  try {
    await Event.findOneAndUpdate(
      { id: eventId },
      {
        title, description, date, hero_image,
        tags: JSON.stringify(tags),
        timeline: JSON.stringify(timeline),
        faqs: JSON.stringify(faqs),
        gallery: JSON.stringify(gallery),
        price, discount_price, session_text, location_text, location_link
      },
      { upsert: true, new: true }
    );
    res.json({ success: true, id: eventId });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/admin/events/:id', requireAuth, async (req, res) => {
  try {
    await Event.deleteOne({ id: req.params.id });
    await Session.deleteMany({ eventId: req.params.id });
    res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/sessions', async (req, res) => {
  try {
    const { eventId } = req.query;
    let query = {};
    if (eventId) {
      query = { eventId };
    }
    const rows = await Session.find(query).lean();
    res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/sessions', requireAuth, async (req, res) => {
  const { eventId, name, time, capacity, price } = req.body;
  const sessionId = 'sess_' + Math.random().toString(36).substr(2, 9);
  
  try {
    await Session.create({
      id: sessionId,
      eventId,
      name,
      time,
      capacity,
      booked: 0,
      price
    });
    res.json({ success: true, id: sessionId });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/admin/sessions/:id', requireAuth, async (req, res) => {
  try {
    await Session.deleteOne({ id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/book', upload.single('receipt'), async (req, res) => {
  try {
    const { sessionId, participants, details, userId } = req.body;
    const parsedDetails = JSON.parse(details);
    let receiptUrl = null;
    if (req.file) {
      const fileData = fs.readFileSync(req.file.path);
      receiptUrl = `data:${req.file.mimetype};base64,${fileData.toString('base64')}`;
      try { fs.unlinkSync(req.file.path); } catch (e) {} // cleanup local temp file
    }
    const bookingId = 'BKG-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    const session = await Session.findOne({ id: sessionId });
    if (!session) return res.status(404).json({ error: 'Session not found' });
    
    if (session.booked + parseInt(participants) > session.capacity) {
      return res.status(400).json({ error: 'Not enough spots available.' });
    }
    
    await Booking.create({
      id: bookingId,
      sessionId,
      participants: parseInt(participants),
      details: JSON.stringify(parsedDetails),
      receiptUrl,
      status: 'Pending Approval',
      userId
    });
    
    const msg = `Your payment and booking request (${bookingId}) has been received and is currently pending approval. We will notify you once confirmed.`;
    await Notification.create({ userId, message: msg });
    
    res.json({ success: true, bookingId });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Get public ticket by booking id
app.get('/api/ticket/:id', async (req, res) => {
  try {
    const booking = await Booking.findOne({ id: req.params.id }).lean();
    if (!booking) return res.status(404).json({ error: 'Ticket not found' });
    
    const session = await Session.findOne({ id: booking.sessionId }).lean();
    if (!session) return res.json({ booking: {...booking, details: JSON.parse(booking.details)}, session: null, event: null });
    
    const event = await Event.findOne({ id: session.eventId }).lean();
    
    res.json({
      booking: { ...booking, details: JSON.parse(booking.details) },
      session: session,
      event: event
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Admin get all bookings
app.get('/api/admin/bookings', requireAuth, async (req, res) => {
  try {
    const rows = await Booking.find().sort({ createdAt: -1 }).lean();
    const parsed = rows.map(r => ({
      ...r,
      details: JSON.parse(r.details || '[]')
    }));
    res.json(parsed);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Admin delete a booking
app.delete('/api/admin/bookings/:id', requireAuth, async (req, res) => {
  try {
    await Booking.deleteOne({ id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Admin update capacity
app.post('/api/admin/capacity', requireAuth, async (req, res) => {
  try {
    const { sessionId, capacity } = req.body;
    await Session.updateOne({ id: sessionId }, { capacity });
    res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Admin approve booking
app.post('/api/admin/approve', requireAuth, async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findOne({ id: bookingId });
    
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.status === 'Confirmed') return res.status(400).json({ error: 'Already confirmed' });

    await Session.updateOne(
      { id: booking.sessionId },
      { $inc: { booked: booking.participants } }
    );
    
    await Booking.updateOne({ id: bookingId }, { status: 'Confirmed' });

    const msg = `Your booking (${bookingId}) has been approved! <br><a href="/receipt.html?id=${bookingId}" class="btn btn-outline" style="display:inline-block; margin-top:10px; padding: 0.3rem 0.8rem; text-decoration:none;">View Digital Ticket</a>`;
    await Notification.create({ userId: booking.userId, message: msg });
    
    res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// User get notifications
app.get('/api/notifications/:userId', async (req, res) => {
  try {
    const rows = await Notification.find({ userId: req.params.userId }).sort({ createdAt: -1 }).lean();
    const mapped = rows.map(r => ({ ...r, id: r._id }));
    res.json(mapped);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/notifications/read', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || ids.length === 0) return res.json({success: true});
    
    await Notification.updateMany(
      { _id: { $in: ids } }, // wait, frontend sends sqlite IDs which were integers. Let's assume they send mongo _id strings now, but our schema doesn't have an explicit 'id' string, we use mongo _id implicitly. Let's check how frontend reads it.
      { isRead: 1 }
    );
    res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
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
