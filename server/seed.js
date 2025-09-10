// seed.js - seeds 10 videoId docs into the videos collection
require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('Missing MONGO_URI in .env');
  process.exit(1);
}

const videoSchema = new mongoose.Schema({ videoId: { type: String, required: true, unique: true }}, { collection: 'videos' });
const Video = mongoose.models.Video || mongoose.model('Video', videoSchema);

// seed.js
const videoIds = [
  "FRDNEP8unTo",
  "IcDr8_oleB4",
  "KHL_vWcDYFs",
  "XvFmUE-36Kc",
  "hmtuvNfytjM",
  "DkSRe5bUEDM",
  "qbt-MFVvQQY",
  "O7O204wD82s",
  "ztHopE5Wnpc",
  "kPlLv6pC3JE"
];



async function seed() {
  await mongoose.connect(MONGO_URI, {
    dbName: 'learnoverse',
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log('Connected to MongoDB for seeding');
  await Video.deleteMany({});
  const docs = videoIds.map(id => ({ videoId: id }));
  await Video.insertMany(docs);
  console.log(`Inserted ${docs.length} videos`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
