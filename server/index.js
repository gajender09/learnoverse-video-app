// index.js - main server
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const YT_KEY = process.env.YT_API_KEY;

if (!MONGO_URI) {
  console.error('Missing MONGO_URI in .env');
  process.exit(1);
}
if (!YT_KEY) {
  console.error('Missing YT_API_KEY in .env');
  process.exit(1);
}

const videoSchema = new mongoose.Schema({
  videoId: { type: String, required: true, unique: true }
}, { collection: 'videos' });

const Video = mongoose.models.Video || mongoose.model('Video', videoSchema);

/**
 * Convert ISO 8601 duration (YouTube contentDetails.duration) to mm:ss or hh:mm:ss
 * e.g. PT1H2M10S -> 1:02:10, PT5M3S -> 5:03
 */
function parseISO8601Duration(iso = '') {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '0:00';
  const [, h = '0', m = '0', s = '0'] = match;
  const H = parseInt(h, 10);
  const M = parseInt(m, 10);
  const S = parseInt(s, 10);
  const total = H * 3600 + M * 60 + S;
  const hh = Math.floor(total / 3600);
  const mm = Math.floor((total % 3600) / 60);
  const ss = total % 60;
  if (hh > 0) return `${hh}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
  return `${mm}:${String(ss).padStart(2, '0')}`;
}

/**
 * Fetch metadata for up to 50 video ids at once.
 * Returns a Map(videoId => metadata)
 */
async function fetchYTMetadata(ids = []) {
  if (!ids.length) return new Map();
  const idParam = ids.join(',');
  const url = `https://www.googleapis.com/youtube/v3/videos`;
  const params = {
    part: 'snippet,contentDetails',
    id: idParam,
    key: YT_KEY
  };

  const response = await axios.get(url, { params, timeout: 10000 });
  const items = response.data.items || [];
  const map = new Map();
  for (const item of items) {
    map.set(item.id, {
      title: item.snippet?.title || null,
      channelTitle: item.snippet?.channelTitle || null,
      thumbnails: item.snippet?.thumbnails || null,
      duration: parseISO8601Duration(item.contentDetails?.duration || '')
    });
  }
  return map;
}

// GET /videos -> return array of enriched objects
app.get('/videos', async (req, res) => {
  try {
    const docs = await Video.find().lean().exec();
    const ids = docs.map(d => d.videoId).filter(Boolean);
    if (!ids.length) return res.json({ videos: [] });

    const ytMap = await fetchYTMetadata(ids);
    const enriched = ids.map(id => {
      const meta = ytMap.get(id);
      return {
        videoId: id,
        title: meta?.title || null,
        channelTitle: meta?.channelTitle || null,
        thumbnails: meta?.thumbnails || null,
        duration: meta?.duration || null
      };
    });

    return res.json({ videos: enriched });
  } catch (err) {
    console.error('GET /videos error', err?.message || err);
    return res.status(500).json({ error: 'server error' });
  }
});

// health
app.get('/health', (req, res) => res.json({ ok: true }));

async function start() {
  try {
    await mongoose.connect(MONGO_URI, {
      dbName: 'learnoverse',
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
