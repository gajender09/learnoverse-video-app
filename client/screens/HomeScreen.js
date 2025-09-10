import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, Pressable, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import axios from 'axios';
import { SERVER_URL } from '../config';

export default function HomeScreen({ navigation }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchVideos() {
    try {
      const res = await axios.get(`${SERVER_URL}/videos`, { timeout: 8000 });
      setVideos(res.data.videos || []);
    } catch (err) {
      console.error('Fetch error', err.message);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchVideos(); }, []);

  async function onRefresh() {
    setRefreshing(true);
    await fetchVideos();
    setRefreshing(false);
  }

  function renderItem({ item }) {
    const thumb = item.thumbnails?.medium?.url || `https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg`;
    return (
      <Pressable onPress={() => navigation.navigate('Player', { video: item })}
                 style={({ pressed }) => [styles.item, pressed && { opacity: 0.7 }]}>
        <Image source={{ uri: thumb }} style={styles.thumb} />
        <View style={styles.meta}>
          <Text style={styles.title} numberOfLines={2}>{item.title || 'Untitled'}</Text>
          <Text style={styles.sub}>{item.channelTitle || 'Unknown'} • {item.duration || '--:--'}</Text>
        </View>
      </Pressable>
    );
  }

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  return (
    <FlatList
      data={videos}
      keyExtractor={i => i.videoId}
      renderItem={renderItem}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#e5e7eb' }} />}
      contentContainerStyle={{ paddingBottom: 20 }}
      ListEmptyComponent={<View style={styles.center}><Text>No videos found</Text></View>}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  item: { flexDirection: 'row', padding: 12, alignItems: 'center' },
  thumb: { width: 160, height: 90, borderRadius: 8, backgroundColor: '#ddd' },
  meta: { flex: 1, paddingLeft: 12 },
  title: { fontSize: 16, fontWeight: '600', color: '#111827' },
  sub: { fontSize: 13, color: '#6b7280', marginTop: 4 }
});
