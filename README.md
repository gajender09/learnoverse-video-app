# LEARNOVERSE - Video App

A full-stack project with:
* **Backend (server/)**: Node.js + Express + MongoDB Atlas
* **Frontend (client/)**: React Native (Expo) app
* **YouTube Data API v3**: Fetches live metadata (title, channel, thumbnail, duration) for stored video IDs.

## 🎥 See It In Action
- <a href="https://drive.google.com/file/d/1F6GG1A6WvFQgIXjciTCsaWSbO9AdSBHZ/view?usp=sharing" target="_blank">Watch Video </a>

## ⚙️ How It Works

* **MongoDB Atlas** stores video IDs (e.g., `FRDNEP8unTo`).
* The **Express server** (`/videos` endpoint):
  * Reads video IDs from MongoDB.
  * Calls YouTube Data API v3 with your API key.
  * Enriches each ID with metadata (title, channel, thumbnails, duration).
  * Returns JSON to the client.
* The **React Native client**:
  * Fetches `/videos` from the backend.
  * Displays a scrollable list of video thumbnails & titles.
  * Taps navigate to a Player Screen with embedded YouTube video.

## 📂 Project Structure

```
video-app/
├── server/              # Backend (Express + MongoDB)
│   ├── index.js
│   ├── package.json
│   └── .env
├── client/              # Frontend (Expo React Native)
│   ├── App.js
│   ├── config.js
│   ├── screens/
│   │   ├── HomeScreen.js
│   │   └── PlayerScreen.js
│   └── package.json
└── README.md            # This file
```

## 🚀 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/gajender09/learnoverse-video-app.git
cd learnoverse-video-app
```

### 2. Backend (server)

Go inside the server folder:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create `.env` file:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
YT_API_KEY=<your-youtube-api-key>
PORT=5000
```

Start server:

```bash
npm start
```

Test endpoint:

```bash
curl http://localhost:5000/videos
```

You should see a JSON array of video objects.

### 3. Database (MongoDB Atlas)

* **Database name**: `learnoverse` (set in `index.js`)
* **Collection name**: `videos`
* **Documents format**:

```json
{ "videoId": "FRDNEP8unTo" }
```

Insert multiple video IDs either via Compass or `seed.js`.

### 4. Frontend (client)

Go inside the client folder:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create `config.js` with your server IP:

```javascript
export const SERVER_URL = 'http://<your-PC-LAN-IP>:5000';
```

Get your PC LAN IP using `ipconfig`. 

Start Expo:

```bash
npm start
```

Run app:
* Press `a` → Android emulator
* Press `i` → iOS simulator (Mac only)
* Scan QR code in Expo Go on your phone

## 🌐 Networking Notes

* The client (phone) cannot use `localhost`. Always use your PC's LAN IP.
* Phone and PC must be on the same Wi-Fi network.
* If phone can't connect:
  * Check firewall → allow `node.exe` on Private networks.
  * Confirm in mobile browser: `http://<LAN-IP>:5000/videos`

## 🖥️ Usage Flow

1. Add video IDs into MongoDB (`videos` collection).
2. Start backend → `npm start` (server).
3. Start frontend → `npm start` (Expo).
4. Open Expo Go app → videos list loads.
5. Tap a video → navigates to `PlayerScreen` with embedded YouTube player.

## ✅ Tech Stack

* **Backend**: Node.js, Express, Mongoose, Axios
* **Frontend**: React Native (Expo), React Navigation, `react-native-youtube-iframe`
* **Database**: MongoDB Atlas
* **External API**: YouTube Data API v3

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account
- YouTube Data API v3 key
- Expo CLI (for React Native development)

## 🔧 Environment Variables

Make sure to set up these environment variables in your `.env` file:

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB Atlas connection string |
| `YT_API_KEY` | YouTube Data API v3 key |
| `PORT` | Server port (default: 5000) |
