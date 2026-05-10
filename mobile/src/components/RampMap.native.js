import MapView, { Marker } from 'react-native-maps';

export default function RampMap({ region, style, markers = [], selectedMarker, onMapPress, onRegionChangeComplete }) {
  return (
    <MapView
      style={style}
      region={region}
      onPress={onMapPress}
      onLongPress={onMapPress}
      onRegionChangeComplete={onRegionChangeComplete}
      scrollEnabled
      zoomEnabled
      rotateEnabled
      pitchEnabled
      toolbarEnabled={false}
    >
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={marker.coordinate}
          title={marker.title}
          description={marker.description}
          onCalloutPress={marker.onPress}
        />
      ))}
      {selectedMarker && <Marker coordinate={selectedMarker.coordinate} title={selectedMarker.title || 'Selected location'} />}
    </MapView>
  );
}
