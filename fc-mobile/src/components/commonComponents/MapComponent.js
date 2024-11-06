import React, { useRef } from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet } from 'react-native';

const MapComponent = ({ initialLocation, onCoordinatesChange }) => {
  const webViewRef = useRef(null);

  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.css" />
      <style>
        #map { height: 100vh; width: 100%; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.js"></script>
      <script>
        var initialLocation = ${initialLocation ? JSON.stringify(initialLocation) : '[-15.7942, -47.8822]'}; // Posição padrão ou localização do usuário

        var map = L.map('map').setView(initialLocation, 15);

        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          maxZoom: 18,
          attribution: 'Tiles &copy; Esri'
        }).addTo(map);

        var drawnItems = new L.FeatureGroup();
        map.addLayer(drawnItems);

        var drawControl = new L.Control.Draw({
          edit: {
            featureGroup: drawnItems,
          },
          draw: {
            polygon: {
              allowIntersection: false,
              showArea: true,
            },
            polyline: false,
            circle: false,
            rectangle: false,
            marker: false,
          },
        });
        map.addControl(drawControl);

        map.on(L.Draw.Event.CREATED, function (event) {
          var layer = event.layer;
          drawnItems.addLayer(layer);
          var coordinates = layer.getLatLngs()[0].map(latlng => [latlng.lat, latlng.lng]);
          window.ReactNativeWebView.postMessage(JSON.stringify(coordinates));
        });
      </script>
    </body>
    </html>
  `;

  const onMessage = (event) => {
    const data = event.nativeEvent.data;
    try {
      const coordinates = JSON.parse(data);
      onCoordinatesChange(coordinates);
    } catch (error) {
      console.error('Error parsing coordinates:', error);
    }
  };

  return (
    <WebView
      ref={webViewRef}
      originWhitelist={['*']}
      source={{ html: mapHtml }}
      style={styles.webView}
      onMessage={onMessage}
    />
  );
};

const styles = StyleSheet.create({
  webView: {
    flex: 1,
  },
});

export default MapComponent;
