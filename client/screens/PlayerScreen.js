import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

const { width } = Dimensions.get('window');

export default function PlayerScreen({ route }) {
  const { video } = route.params || {};
  const [playing, setPlaying] = useState(true);
  const playerRef = useRef(null);

  if (!video) {
    return <View style={styles.center}><Text>No video selected</Text></View>;
  }

  return (
    <View style={styles.container}>
      <YoutubePlayer
        ref={playerRef}
        height={(width * 9) / 16}
        play={playing}
        videoId={video.videoId}
        onChangeState={state => {
          if (state === 'ended') setPlaying(false);
        }}
      />
      <View style={styles.info}>
        <Text style={styles.title}>{video.title || 'Untitled'}</Text>
        <Text style={styles.sub}>{video.channelTitle || 'Unknown'} • {video.duration || '--:--'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  info: { padding: 14 },
  title: { fontSize: 18, fontWeight: '700', color: '#111827' },
  sub: { fontSize: 13, color: '#6b7280', marginTop: 6 }
});
