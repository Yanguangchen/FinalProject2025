import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Platform } from 'react-native';
import ArrowBack from '../UI/arrow-back';
import ButtonShort from '../UI/button-short';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function ElevationMapScreen() {
  const navigation = useNavigation();
  const [coords, setCoords] = React.useState({ lat: 1.3521, lng: 103.8198 }); // Singapore default
  const [elevationM, setElevationM] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [routeToCoords, setRouteToCoords] = React.useState(null);
  const [routeElevationM, setRouteElevationM] = React.useState(null);

  const mapsApiKey =
    (typeof process !== 'undefined' && process.env && (process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY)) || '';
  const mapTilerKey =
    (typeof process !== 'undefined' && process.env && (process.env.EXPO_PUBLIC_MAPTILER_KEY || process.env.MAPTILER_KEY)) || '';

  const loadGMapsJs = React.useCallback(async () => {
    if (Platform.OS !== 'web') return;
    if (typeof window !== 'undefined' && window.google && window.google.maps && window.google.maps.ElevationService) return;
    if (!mapsApiKey) throw new Error('Missing Google Maps API key');
    if (typeof window !== 'undefined' && window.__gmapsPromise) return window.__gmapsPromise;
    const p = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${mapsApiKey}&loading=async`;
      script.async = true;
      script.defer = true;
      script.onerror = (e) => reject(new Error('Failed to load Google Maps JS API'));
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
    if (typeof window !== 'undefined') window.__gmapsPromise = p;
    return p;
  }, [mapsApiKey]);

  const fetchElevation = React.useCallback(async (lat, lng) => {
    if (!mapsApiKey) {
      setError('Missing Google Maps API key');
      setElevationM(null);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      if (Platform.OS === 'web') {
        await loadGMapsJs();
        if (!(window.google && window.google.maps && window.google.maps.ElevationService)) {
          throw new Error('Google Maps JS not available');
        }
        const service = new window.google.maps.ElevationService();
        const results = await new Promise((resolve, reject) => {
          service.getElevationForLocations({ locations: [{ lat, lng }] }, (res, status) => {
            if (status === 'OK' && res && res.length) resolve(res);
            else reject(new Error(`ELEVATION_FAILED_${status || 'UNKNOWN'}`));
          });
        });
        setElevationM(Math.round(results[0].elevation));
      } else {
        const url = `https://maps.googleapis.com/maps/api/elevation/json?locations=${lat},${lng}&key=${mapsApiKey}`;
        const resp = await fetch(url, { method: 'GET', cache: 'no-store' });
        const data = await resp.json();
        if (data.status !== 'OK' || !data.results || !data.results.length) {
          setError('Elevation lookup failed');
          setElevationM(null);
          return;
        }
        setElevationM(Math.round(data.results[0].elevation));
      }
    } catch (e) {
      setError('Elevation lookup failed on web. Please allow Google Maps scripts (ad blockers can block it).');
      setElevationM(null);
    } finally {
      setLoading(false);
    }
  }, [mapsApiKey]);

  const fetchElevationsBatch = React.useCallback(async (points) => {
    if (!mapsApiKey || !points || points.length === 0) return null;
    try {
      if (Platform.OS === 'web') {
        await loadGMapsJs();
        if (!(window.google && window.google.maps && window.google.maps.ElevationService)) return null;
        const service = new window.google.maps.ElevationService();
        const locations = points.map((p) => ({ lat: p.lat, lng: p.lng }));
        const CHUNK = 256;
        const all = [];
        for (let i = 0; i < locations.length; i += CHUNK) {
          const slice = locations.slice(i, i + CHUNK);
          // eslint-disable-next-line no-await-in-loop
          const batch = await new Promise((resolve, reject) => {
            service.getElevationForLocations({ locations: slice }, (res, status) => {
              if (status === 'OK' && res && res.length) resolve(res);
              else reject(new Error(`ELEVATION_FAILED_${status || 'UNKNOWN'}`));
            });
          });
          // Normalize JS API LatLng to plain numbers
          for (const r of batch) {
            all.push({
              elevation: r.elevation,
              resolution: r.resolution,
              location: {
                lat: typeof r.location.lat === 'function' ? r.location.lat() : r.location.lat,
                lng: typeof r.location.lng === 'function' ? r.location.lng() : r.location.lng,
              },
            });
          }
        }
        return all;
      } else {
        const CHUNK = 256;
        const all = [];
        for (let i = 0; i < points.length; i += CHUNK) {
          const slice = points.slice(i, i + CHUNK);
          const locParam = slice.map((p) => `${p.lat},${p.lng}`).join('|');
          const url = `https://maps.googleapis.com/maps/api/elevation/json?locations=${encodeURIComponent(locParam)}&key=${mapsApiKey}`;
          // eslint-disable-next-line no-await-in-loop
          const resp = await fetch(url, { method: 'GET', cache: 'no-store' });
          // eslint-disable-next-line no-await-in-loop
          const data = await resp.json();
          if (data.status !== 'OK' || !data.results || !data.results.length) {
            continue;
          }
          all.push(...data.results);
        }
        return all.length ? all : null;
      }
    } catch (_e) {
      return null;
    }
  }, [mapsApiKey, loadGMapsJs]);

  const locateAndUpdate = React.useCallback(async () => {
    setError(null);
    // Web geolocation
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.geolocation) {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords;
            const next = { lat: latitude, lng: longitude };
            setCoords(next);
            await fetchElevation(next.lat, next.lng);
            resolve();
          },
          async () => {
            setError('Location permission denied');
            await fetchElevation(coords.lat, coords.lng);
            resolve();
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
        );
      });
    }
    // Native geolocation via expo-location (dynamic import so app won't crash if not installed)
    try {
      // eslint-disable-next-line global-require
      const Location = await import('expo-location');
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied');
        await fetchElevation(coords.lat, coords.lng);
        return;
      }
      const current = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const next = { lat: current.coords.latitude, lng: current.coords.longitude };
      setCoords(next);
      await fetchElevation(next.lat, next.lng);
    } catch (_e) {
      setError('Geolocation unavailable; install expo-location');
      await fetchElevation(coords.lat, coords.lng);
    }
  }, [coords.lat, coords.lng, fetchElevation]);

  React.useEffect(() => {
    // Try to locate on mount; falls back to default coords elevation if permission denied/unavailable
    locateAndUpdate();
  }, [locateAndUpdate]);

  const handleNearMe = React.useCallback(() => {
    locateAndUpdate();
  }, [locateAndUpdate]);

  const metersToLatDeg = (meters) => meters / 111320; // approx
  const metersToLngDeg = (meters, atLat) => meters / (111320 * Math.cos((atLat * Math.PI) / 180));

  // no heatmap rendering; we keep the map clean and topographic

  const handleRouteToHighestNearby = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Scan within ~2km radius at 100m resolution (chunked requests under the hood)
      const radiusMeters = 2000;
      const stepMeters = 100;
      const maxSteps = Math.floor(radiusMeters / stepMeters);
      const latStep = metersToLatDeg(stepMeters);
      const lngStep = metersToLngDeg(stepMeters, coords.lat);
      const points = [];
      for (let dy = -maxSteps; dy <= maxSteps; dy++) {
        for (let dx = -maxSteps; dx <= maxSteps; dx++) {
          const dist = Math.sqrt(dx * dx + dy * dy) * stepMeters;
          if (dist > radiusMeters) continue;
          const lat = coords.lat + dy * latStep;
          const lng = coords.lng + dx * lngStep;
          points.push({ lat, lng });
        }
      }
      const results = await fetchElevationsBatch(points);
      if (!results) {
        setError('Failed to find nearby elevations');
        setRouteToCoords(null);
        setRouteElevationM(null);
        return;
      }
      // Choose highest elevation; tie-break to nearest distance
      let best = null;
      for (let i = 0; i < results.length; i++) {
        const r = results[i];
        if (!r || typeof r.elevation !== 'number' || !r.location) continue;
        const lat = typeof r.location.lat === 'function' ? r.location.lat() : r.location.lat;
        const lng = typeof r.location.lng === 'function' ? r.location.lng() : r.location.lng;
        if (lat == null || lng == null) continue;
        const dLatM = (lat - coords.lat) * 111320;
        const dLngM = (lng - coords.lng) * 111320 * Math.cos((coords.lat * Math.PI) / 180);
        const dist = Math.sqrt(dLatM * dLatM + dLngM * dLngM);
        const candidate = { lat, lng, elevation: r.elevation, dist };
        if (
          !best ||
          candidate.elevation > best.elevation ||
          (candidate.elevation === best.elevation && candidate.dist < best.dist)
        ) {
          best = candidate;
        }
      }
      if (!best) {
        setRouteToCoords(null);
        setRouteElevationM(null);
        setError('No elevation candidates found');
        return;
      }
      setRouteToCoords({ lat: best.lat, lng: best.lng });
      setRouteElevationM(Math.round(best.elevation));
    } finally {
      setLoading(false);
    }
  }, [coords.lat, coords.lng, fetchElevationsBatch]);

  // Build a Leaflet + OpenTopoMap HTML (srcDoc) with markers for current and target locations
  const buildTopoHtml = React.useCallback((from, to, toElevationM, baseUrl, baseAttr, addHillshade, contoursUrl) => {
    const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossorigin="anonymous">
    <style>
      html, body, #map { height: 100%; margin: 0; padding: 0; }
      #map { position: relative; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" crossorigin="anonymous"></script>
    <script>
      (function() {
        var fromLat = ${from.lat};
        var fromLng = ${from.lng};
        var map = L.map('map', { zoomControl: true }).setView([fromLat, fromLng], 12);
        // Base terrain colors/outlines
        var base = L.tileLayer('${baseUrl}', {
          maxZoom: 17,
          attribution: '${baseAttr}'
        }).addTo(map);
        ${addHillshade ? `
        var hill = L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}', {
          maxZoom: 17,
          attribution: 'Hillshade: Esri World_Hillshade | Data sources: USGS, Esri, others'
        }).addTo(map);
        ` : ''}
        ${contoursUrl ? `
        var contours = L.tileLayer('${contoursUrl}', {
          maxZoom: 17,
          opacity: 0.85,
          attribution: 'Contours: MapTiler'
        }).addTo(map);
        ` : ''}
        var me = L.marker([fromLat, fromLng], { title: 'Your location' }).addTo(map).bindPopup('Your location');
        ${to ? `
        var toLat = ${to.lat};
        var toLng = ${to.lng};
        var target = L.marker([toLat, toLng], { title: 'Highest nearby' }).addTo(map).bindPopup('Highest nearby${toElevationM != null ? `: ${toElevationM} m` : ''}');
        var line = L.polyline([[fromLat, fromLng], [toLat, toLng]], { color: '#0075FF', weight: 3, opacity: 0.8 }).addTo(map);
        // Use a fixed zoom to avoid provider zoom gaps that may show blank tiles
        var midLat = (fromLat + toLat) / 2;
        var midLng = (fromLng + toLng) / 2;
        map.setView([midLat, midLng], 15);
        ` : ''}
      })();
    </script>
  </body>
</html>`;
    return html;
  }, []);

  // Fallback Data URL (older browsers without srcDoc)
  const buildTopoDataUrl = React.useCallback((from, to, toElevationM, baseUrl, baseAttr, addHillshade, contoursUrl) => {
    const html = buildTopoHtml(from, to, toElevationM, baseUrl, baseAttr, addHillshade, contoursUrl);
    return 'data:text/html;charset=utf-8,' + encodeURIComponent(html);
  }, [buildTopoHtml]);

  const webMapHtml = React.useMemo(() => {
    const hasMapTiler = Boolean(mapTilerKey);
    const contoursUrl = hasMapTiler ? `https://api.maptiler.com/tiles/contours/{z}/{x}/{y}.png?key=${mapTilerKey}` : '';
    const baseUrl = hasMapTiler
      ? `https://api.maptiler.com/maps/terrain/256/{z}/{x}/{y}.png?key=${mapTilerKey}`
      : 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
    const baseAttr = hasMapTiler
      ? 'Terrain: MapTiler'
      : 'Map data: © OpenStreetMap contributors, SRTM | Style: © OpenTopoMap (CC-BY-SA)';
    const addHillshade = hasMapTiler ? false : false;
    return buildTopoHtml(coords, routeToCoords, routeElevationM, baseUrl, baseAttr, addHillshade, contoursUrl);
  }, [buildTopoHtml, coords, routeToCoords, routeElevationM, mapTilerKey]);

  const webMapSrc = React.useMemo(() => {
    // Fallback for browsers that don't support srcDoc
    const hasMapTiler = Boolean(mapTilerKey);
    const contoursUrl = hasMapTiler ? `https://api.maptiler.com/tiles/contours/{z}/{x}/{y}.png?key=${mapTilerKey}` : '';
    const baseUrl = hasMapTiler
      ? `https://api.maptiler.com/maps/terrain/256/{z}/{x}/{y}.png?key=${mapTilerKey}`
      : 'data:text/html;charset=utf-8,'; // minimal fallback; srcDoc will be used primarily
    const baseAttr = '';
    const addHillshade = false;
    return buildTopoDataUrl(coords, routeToCoords, routeElevationM, baseUrl, baseAttr, addHillshade, contoursUrl);
  }, [buildTopoDataUrl, coords, routeToCoords, routeElevationM, mapTilerKey]);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapArea}>
        {Platform.OS === 'web' ? (
          <iframe
            title="Elevation Map"
            srcDoc={webMapHtml}
            src={webMapSrc}
            style={{ border: 0, width: '100%', height: '100%' }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          <View style={styles.nativePlaceholder}>
            <Text style={styles.nativePlaceholderText}>Elevation map placeholder (mobile)</Text>
          </View>
        )}
      </View>

      <View style={styles.overlayTop}>
        <ArrowBack onPress={() => navigation.goBack()} />
        <View style={styles.topButtons}>
          <ButtonShort title="Elevation Map near me" onPress={handleNearMe} style={styles.topButton} />
          <View style={{ width: 8 }} />
          <ButtonShort title="Highest ground nearby" onPress={handleRouteToHighestNearby} style={styles.topButton} />
        </View>
      </View>

      <View style={styles.overlayBottom}>
        <Ionicons
          name="trending-up"
          size={22}
          color="#ffb300"
          style={{ marginRight: 10 }}
          accessibilityRole="image"
          accessibilityLabel="Elevation trend icon"
          aria-label="Elevation trend icon"
        />
        <Text style={styles.bottomText}>
          Elevation Map {loading ? '(loading...)' : elevationM != null ? `- ${elevationM} m` : ''}
          {routeElevationM != null ? `   |   Target: ${routeElevationM} m` : ''}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  mapArea: { flex: 1 },
  nativePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eef2f4',
  },
  nativePlaceholderText: { color: '#4B4B4B', fontWeight: '700' },
  overlayTop: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  topButtons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 6,
  },
  pill: {
    width: '80%',
    alignSelf: 'center',
    marginLeft: 6,
  },
  topButton: {
    width: '48%',
  },
  overlayBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 8,
    marginHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E7E4E7',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    width: '92%',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  bottomText: { fontSize: 18, fontWeight: '800', color: '#4B4B4B' },
});


