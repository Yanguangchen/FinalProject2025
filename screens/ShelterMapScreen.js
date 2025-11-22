import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Platform } from 'react-native';
import ArrowBack from '../UI/arrow-back';
import ButtonShort from '../UI/button-short';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function ShelterMapScreen() {
  const navigation = useNavigation();

  const [coords, setCoords] = React.useState({ lat: 1.3521, lng: 103.8198 }); // SG default
  const [loading, setLoading] = React.useState(false);
  const mapsApiKey =
    (typeof process !== 'undefined' && process.env && (process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY)) || '';

  const locate = React.useCallback(async () => {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.geolocation) {
      await new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            resolve();
          },
          () => resolve(),
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
        );
      });
    }
  }, []);

  React.useEffect(() => {
    locate();
  }, [locate]);

  const webMapHtml = React.useMemo(() => {
    const c = coords;
    const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>html,body,#map{height:100%;margin:0;padding:0}</style>
    <script>
      function initMap(){
        var center={lat:${c.lat},lng:${c.lng}};
        var map=new google.maps.Map(document.getElementById('map'),{center:center,zoom:14,mapTypeId:'terrain'});
        new google.maps.Marker({position:center,map:map,title:'You'});
        var svc=new google.maps.places.PlacesService(map);
        var all=[], seen={};
        function pushResult(r){
          if(!r||!r.geometry||!r.geometry.location){return;}
          var id=r.place_id||[r.name,r.vicinity].join('|');
          if(seen[id]) return; seen[id]=true;
          all.push(r);
        }
        function addMarkers(){
          if(!all.length){ return; }
          var b=new google.maps.LatLngBounds(); b.extend(center);
          all.forEach(function(r){
            var p=r.geometry.location;
            var m=new google.maps.Marker({position:p,map:map,title:r.name});
            var vic=r.vicinity||r.formatted_address||'';
            var inf=new google.maps.InfoWindow({content:'<strong>'+(r.name||'Shelter')+'</strong><br/>'+vic});
            m.addListener('click',function(){inf.open(map,m)});
            b.extend(p);
          });
          map.fitBounds(b,40);
        }
        // 1) Nearby search with generic keyword to maximize hits
        var nearbyReq={location:center,radius:10000,keyword:'shelter',type:'point_of_interest'};
        svc.nearbySearch(nearbyReq,function(res,status){
          if(status===google.maps.places.PlacesServiceStatus.OK && res){ res.forEach(pushResult); }
          // 2) Text search fallback focused on SCDF/public shelters
          var textReq={query:'SCDF shelter OR public shelter', location:center, radius:10000, region:'sg'};
          svc.textSearch(textReq,function(res2,status2){
            if(status2===google.maps.places.PlacesServiceStatus.OK && res2){ res2.forEach(pushResult); }
            addMarkers();
          });
        });
      }
    </script>
    <script async defer src="https://maps.googleapis.com/maps/api/js?key=${mapsApiKey}&libraries=places&callback=initMap&loading=async&language=en&region=SG"></script>
  </head>
  <body><div id="map"></div></body>
</html>`;
    return html;
  }, [coords, mapsApiKey]);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapArea}>
        {Platform.OS === 'web' ? (
          <iframe
            title="Shelter Map"
            srcDoc={webMapHtml}
            style={{ border: 0, width: '100%', height: '100%' }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          <View style={styles.nativePlaceholder}>
            <Text style={styles.nativePlaceholderText}>Map placeholder (mobile)</Text>
          </View>
        )}
      </View>

      {/* Overlays */}
      <View style={styles.overlayTop}>
        <ArrowBack onPress={() => navigation.goBack()} />
        <ButtonShort title={loading ? 'Locating...' : 'Shelter Locations near me'} onPress={async () => {
          try {
            setLoading(true);
            await locate();
          } finally {
            setLoading(false);
          }
        }} style={styles.pill} />
      </View>

      <View style={styles.overlayBottom}>
        <Ionicons name="home" size={22} color="#ffb300" style={{ marginRight: 10 }} />
        <Text style={styles.bottomText}>Shelter Locations</Text>
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
  pill: {
    width: '80%',
    alignSelf: 'center',
    marginLeft: 6,
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


